/**
 * plugins/autoreact.js
 * Toggle global auto-react & manage emoji pool.
 *
 * Commands:
 *   .autoreact            -> show current status + emoji list
 *   .autoreact on         -> enable auto-react
 *   .autoreact off        -> disable auto-react
 *   .reactemojis 😀,😎,🔥 -> set custom emoji list (comma-separated)
 *
 * Permission: owner + developers (numbers below).
 */

const fs = require("fs");
const path = require("path");
const config = require("../config.js");
const { cmd } = require("../lib/command");

// Developer + owner control list
const DEV_NUMBERS = [
  config.OWNER_NUMBER,
  "923192173398",
  "263788049675"
].filter(Boolean); // remove empties

/* --------------------------------------------------------------
 * Persisted settings
 * ------------------------------------------------------------ */
const STORE_DIR = path.join(__dirname, "..", "data");
if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
const STORE_FILE = path.join(STORE_DIR, "autoreact.json");

// Load stored state (if any) and apply to config
(function initLoad() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = JSON.parse(fs.readFileSync(STORE_FILE, "utf-8"));
      if (typeof raw.autoReact === "boolean") config.AUTO_REACT = raw.autoReact;
      if (typeof raw.emojis === "string" && raw.emojis.trim())
        config.CUSTOM_REACT_EMOJIS = raw.emojis;
    }
  } catch (err) {
    console.error("[AUTO-REACT] Failed loading saved state:", err);
  }
})();

function saveState() {
  const data = {
    autoReact: !!config.AUTO_REACT,
    emojis: String(config.CUSTOM_REACT_EMOJIS || "")
  };
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("[AUTO-REACT] Failed saving state:", err);
  }
}

/* --------------------------------------------------------------
 * Permission helper
 * ------------------------------------------------------------ */
function getSenderNumber(m) {
  // group msg -> participant; direct -> remoteJid
  const jid = m.key.participant || m.key.remoteJid || "";
  return jid.split("@")[0];
}
function isAuthorized(m) {
  const num = getSenderNumber(m);
  return DEV_NUMBERS.includes(num);
}

/* --------------------------------------------------------------
 * Pretty print current settings
 * ------------------------------------------------------------ */
function statusText() {
  const flag = config.AUTO_REACT ? "ON ✅" : "OFF ❌";
  const list = String(config.CUSTOM_REACT_EMOJIS || "").split(",").map(s=>s.trim()).filter(Boolean);
  const emojis = list.length ? list.join(" ") : "(default pool)";
  return `*Auto-React:* ${flag}\n*Emojis:* ${emojis}`;
}

/* --------------------------------------------------------------
 * .autoreact command
 * ------------------------------------------------------------ */
cmd(
  {
    pattern: "autoreact",
    desc: "Enable, disable, or check auto-react status.",
    category: "system",
    filename: __filename
  },
  async (sock, m, ctx) => {
    const { args } = ctx;

    if (!isAuthorized(m)) {
      return sock.sendMessage(m.key.remoteJid, { text: "❌ Not authorized." }, { quoted: m });
    }

    if (!args.length) {
      return sock.sendMessage(m.key.remoteJid, { text: statusText() }, { quoted: m });
    }

    const arg = args[0].toLowerCase();
    if (["on","enable","true","1"].includes(arg)) {
      config.AUTO_REACT = true;
      saveState();
      return sock.sendMessage(m.key.remoteJid, { text: "✅ Auto-React enabled." }, { quoted: m });
    }
    if (["off","disable","false","0"].includes(arg)) {
      config.AUTO_REACT = false;
      saveState();
      return sock.sendMessage(m.key.remoteJid, { text: "🚫 Auto-React disabled." }, { quoted: m });
    }

    // unknown arg
    return sock.sendMessage(
      m.key.remoteJid,
      { text: "Usage: .autoreact on | off" },
      { quoted: m }
    );
  }
);

/* --------------------------------------------------------------
 * .reactemojis command
 * ------------------------------------------------------------ */
cmd(
  {
    pattern: "reactemojis",
    alias: ["reactemoji", "setreact"],
    desc: "Set custom emoji list for auto-react (comma-separated).",
    category: "system",
    filename: __filename
  },
  async (sock, m, ctx) => {
    const { args, text } = ctx;

    if (!isAuthorized(m)) {
      return sock.sendMessage(m.key.remoteJid, { text: "❌ Not authorized." }, { quoted: m });
    }

    const raw = text.trim();
    if (!raw) {
      return sock.sendMessage(
        m.key.remoteJid,
        { text: "Usage: .reactemojis 😀,😎,🔥" },
        { quoted: m }
      );
    }

    // Accept comma-separated or space-separated
    const cleaned = raw
      .split(/[, ]+/)
      .map(e => e.trim())
      .filter(Boolean)
      .join(",");

    if (!cleaned.length) {
      return sock.sendMessage(
        m.key.remoteJid,
        { text: "⚠️ No valid emojis found." },
        { quoted: m }
      );
    }

    config.CUSTOM_REACT_EMOJIS = cleaned;
    saveState();
    return sock.sendMessage(
      m.key.remoteJid,
      { text: `✅ Updated emoji list:\n${cleaned.split(",").join(" ")}` },
      { quoted: m }
    );
  }
);

module.exports = {}; // nothing exported (registration happens via cmd())
