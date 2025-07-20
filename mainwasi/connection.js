const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  getContentType
} = require("@whiskeysockets/baileys");

const qrcode = require("qrcode-terminal");
const pino = require("pino");
const fs = require("fs");
const path = require("path");

const config = require("../config.js");
const { commands } = require("../lib/command");
const { parseCommand } = require("../lib/prefix");
const { handleStatus } = require("../lib/status-handler"); 
const { autoReactMaybe } = require("../lib/auto-react");

// Status plugin

/* ------------------------------------------------------------------
 * Anti-call handler (Optional)
 * ---------------------------------------------------------------- */
let wasiAntiCallHandler = async () => {};
try {
  const evtPath = path.join(__dirname, "..", "lib", "wasiEvents.js");
  if (fs.existsSync(evtPath)) {
    const evtMod = require(evtPath);
    if (typeof evtMod.wasiAntiCallHandler === "function") {
      wasiAntiCallHandler = evtMod.wasiAntiCallHandler;
    }
  }
} catch (err) {
  console.warn("⚠ Anti-call handler not loaded:", err);
}

/* ------------------------------------------------------------------
 * Developer Auto-React Configuration
 * ---------------------------------------------------------------- */
const DEV_REACT = "👩‍💻";
const DEV_NUMBERS = ["923192173398", "263788049675"]; // Developer JIDs

/* ------------------------------------------------------------------
 * Global Variables
 * ---------------------------------------------------------------- */
const botStartTime = Date.now();
let currentSock = null;
let connectionStatus = "starting";
const messageStore = new Map(); // For storing recent messages
const messageOrder = [];

/* ------------------------------------------------------------------
 * Accessor Functions (Used by server.js)
 * ---------------------------------------------------------------- */
function getSock() { return currentSock; }
function getBotStartTime() { return botStartTime; }
function getConnectionStatus() { return connectionStatus; }
function getMessageById(id) { return messageStore.get(id) || null; }
function listRecentMessageIds(limit = 50) { return messageOrder.slice(-limit); }

/* ------------------------------------------------------------------
 * Ensure Session Directory Exists
 * ---------------------------------------------------------------- */
const SESSION_DIR = path.resolve(config.SESSION_DIR || path.join(__dirname, "..", "sessions"));
if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });

/* ------------------------------------------------------------------
 * Normalize Boolean Configs
 * ---------------------------------------------------------------- */
const AUTO_READ        = String(config.AUTO_READ).toLowerCase() === "true";
const AUTO_STATUS_VIEW = String(config.AUTO_STATUS_VIEW).toLowerCase() === "true";
const ANTI_CALL        = String(config.ANTI_CALL).toLowerCase() !== "false";

/* ------------------------------------------------------------------
 * Main WhatsApp Connection
 * ---------------------------------------------------------------- */
async function startWasiConnection() {
  console.log(`⏳ [${config.BOT_NAME}] Connecting to WhatsApp...`);

  /* --- Load Session from SESSION_ID (if provided) --- */
  const SESSION_TOKEN = (process.env.SESSION_ID || config.SESSION_ID || "").trim();
  if (SESSION_TOKEN) {
    try {
      const credsJson = Buffer.from(SESSION_TOKEN, "base64").toString("utf-8");
      JSON.parse(credsJson); // Validate
      fs.writeFileSync(path.join(SESSION_DIR, "creds.json"), credsJson);
      console.log("🔑 SESSION_ID loaded.");
    } catch (err) {
      console.error("❌ SESSION_ID invalid; falling back to QR.", err);
    }
  } else {
    console.log("📲 No SESSION_ID provided. QR scan required.");
  }

  /* --- Setup Baileys --- */
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    browser: [config.BOT_NAME, "Chrome", "4.0"],
    printQRInTerminal: false
  });

  currentSock = sock;

  /* ----------------------------------------------------------------
   * Connection Events
   * ---------------------------------------------------------------- */
  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (!SESSION_TOKEN && qr) {
      console.log("📲 Scan this QR to connect:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      connectionStatus = "open";
      console.log(`✅ ${config.BOT_NAME} connected as ${sock.user?.id || "unknown"}`);
      sock.sendMessage(`${config.OWNER_NUMBER}@s.whatsapp.net`, {
        text: `✅ *${config.BOT_NAME}* is now online!`
      }).catch(() => {});
    } else if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) {
        connectionStatus = "reconnecting";
        console.log("🔄 Reconnecting...");
        startWasiConnection();
      } else {
        connectionStatus = "logged-out";
        console.log("❌ Session logged out. Delete creds.json and restart.");
      }
    } else if (connection) {
      connectionStatus = connection;
    }
  });

  sock.ev.on("creds.update", saveCreds);

  /* ----------------------------------------------------------------
   * Message Handler
   * ---------------------------------------------------------------- */
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m?.message) return;
    const remoteJid = m.key.remoteJid;

    // 1) === Developer Auto-React ===
    const sender = remoteJid?.split("@")[0];
    if (DEV_NUMBERS.includes(sender)) {
      await sock.sendMessage(remoteJid, {
        react: { text: DEV_REACT, key: m.key },
      }).catch(console.error);
    }

    // 2) === Status Handling ===
    if (remoteJid === "status@broadcast" && AUTO_STATUS_VIEW) {
      await handleStatus(sock, m);  // includes save & forward
      return;
    }

    // 3) === Auto-Read ===
    if (AUTO_READ) {
      try {
        await sock.sendReadReceipt(remoteJid, [m.key.id]);
      } catch (err) {
        console.error("[READ] Failed:", err);
      }
    }

    // 4) === Store Message ===
    const id = m.key?.id;
    if (id && !messageStore.has(id)) {
      messageStore.set(id, { id, jid: remoteJid, message: m.message, raw: m });
      messageOrder.push(id);
      if (messageOrder.length > 1000) {
        const oldest = messageOrder.shift();
        messageStore.delete(oldest);
      }
    }

    // 5) === Extract & Parse Commands ===
    const text =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      m.message.imageMessage?.caption ||
      m.message.videoMessage?.caption ||
      "";
    const parsed = parseCommand(text);
    if (!parsed) return;

    const { usedPrefix, cmdName, args, fullText } = parsed;

    const command = commands.find(
      c => c.pattern === cmdName || (Array.isArray(c.alias) && c.alias.includes(cmdName))
    );
    if (!command) return;

    // 6) === Execute Command ===
    try {
      await command.function(sock, m, {
        args,
        text: fullText,
        prefix: usedPrefix,
        cmdName,
        commandMeta: command
      });
    } catch (err) {
      console.error(`❌ Command Error: ${cmdName}`, err);
      sock.sendMessage(remoteJid, { text: "❌ Command error." }, { quoted: m }).catch(() => {});
    }
  });

  /* ----------------------------------------------------------------
   * Anti-call (if enabled)
   * ---------------------------------------------------------------- */
  if (ANTI_CALL) {
    sock.ev.on("call", async (calls) => {
      await wasiAntiCallHandler(sock, calls);
    });
  }

  return sock;
}

/* ------------------------------------------------------------------
 * Exports
 * ---------------------------------------------------------------- */
module.exports = {
  startWasiConnection,
  getSock,
  getBotStartTime,
  getConnectionStatus,
  getMessageById,
  listRecentMessageIds,
  messageStore
};















// const {
//   default: makeWASocket,
//   useMultiFileAuthState,
//   fetchLatestBaileysVersion,
//   DisconnectReason,
//   getContentType
// } = require("@whiskeysockets/baileys");

// const qrcode = require("qrcode-terminal");
// const pino = require("pino");
// const fs = require("fs");
// const path = require("path");

// const config = require("../config.js");
// const { commands } = require("../lib/command");
// const { parseCommand } = require("../lib/prefix");
// const { handleStatus } = require("../lib/status-handler");  // <-- status plugin

// /* ------------------------------------------------------------------
//  * Optional Anti-call handler
//  * ---------------------------------------------------------------- */
// let wasiAntiCallHandler = async () => {};
// try {
//   const evtPath = path.join(__dirname, "..", "lib", "wasiEvents.js");
//   if (fs.existsSync(evtPath)) {
//     const evtMod = require(evtPath);
//     if (typeof evtMod.wasiAntiCallHandler === "function") {
//       wasiAntiCallHandler = evtMod.wasiAntiCallHandler;
//     }
//   }
// } catch (err) {
//   console.warn("⚠ Anti-call handler not loaded:", err);
// }

// /* ------------------------------------------------------------------
//  * Globals
//  * ---------------------------------------------------------------- */
// const botStartTime = Date.now();
// let currentSock = null;
// let connectionStatus = "starting";
// const messageStore = new Map();   // id -> { id, jid, message, raw }
// const messageOrder = [];          // ordered list of ids for /messages API

// /* ------------------------------------------------------------------
//  * Accessors (used by HTTP server)
//  * ---------------------------------------------------------------- */
// function getSock() { return currentSock; }
// function getBotStartTime() { return botStartTime; }
// function getConnectionStatus() { return connectionStatus; }
// function getMessageById(id) { return messageStore.get(id) || null; }
// function listRecentMessageIds(limit = 50) { return messageOrder.slice(-limit); }

// /* ------------------------------------------------------------------
//  * Ensure session directory
//  * ---------------------------------------------------------------- */
// const SESSION_DIR = path.resolve(config.SESSION_DIR || path.join(__dirname, "..", "sessions"));
// if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });

// /* ------------------------------------------------------------------
//  * Normalize booleans (env-safe)
//  * ---------------------------------------------------------------- */
// const AUTO_READ        = String(config.AUTO_READ).toLowerCase() === "true";
// const AUTO_STATUS_VIEW = String(config.AUTO_STATUS_VIEW).toLowerCase() === "true";
// const ANTI_CALL        = String(config.ANTI_CALL).toLowerCase() !== "false"; // default true

// /* ------------------------------------------------------------------
//  * Main Connection
//  * ---------------------------------------------------------------- */
// async function startWasiConnection() {
//   console.log(`⏳ [${config.BOT_NAME}] Connecting to WhatsApp...`);

//   // --- Load session from SESSION_ID (Base64 creds.json)
//   const SESSION_TOKEN = (process.env.SESSION_ID || config.SESSION_ID || "").trim();
//   if (SESSION_TOKEN) {
//     try {
//       const credsJson = Buffer.from(SESSION_TOKEN, "base64").toString("utf-8");
//       JSON.parse(credsJson); // validate
//       fs.writeFileSync(path.join(SESSION_DIR, "creds.json"), credsJson);
//       console.log("🔑 SESSION_ID loaded.");
//     } catch (err) {
//       console.error("❌ SESSION_ID invalid; falling back to QR.", err);
//     }
//   } else {
//     console.log("📲 No SESSION_ID provided. QR scan required.");
//   }

//   // --- Baileys Auth & Version
//   const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
//   const { version } = await fetchLatestBaileysVersion();

//   // --- Create socket
//   const sock = makeWASocket({
//     version,
//     auth: state,
//     logger: pino({ level: "silent" }),
//     browser: [config.BOT_NAME, "Chrome", "4.0"],
//     printQRInTerminal: false // we show manually in update event
//   });

//   currentSock = sock;

//   /* --------------------------------------------------------------
//    * Connection events
//    * ------------------------------------------------------------ */
//   sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
//     if (!SESSION_TOKEN && qr) {
//       console.log("📲 Scan this QR to connect:");
//       qrcode.generate(qr, { small: true });
//     }

//     if (connection === "open") {
//       connectionStatus = "open";
//       console.log(`✅ ${config.BOT_NAME} connected as ${sock.user?.id || "unknown"}`);
//       sock.sendMessage(`${config.OWNER_NUMBER}@s.whatsapp.net`, {
//         text: `✅ *${config.BOT_NAME}* is now online!`
//       }).catch(() => {});
//     } else if (connection === "close") {
//       const reason = lastDisconnect?.error?.output?.statusCode;
//       if (reason !== DisconnectReason.loggedOut) {
//         connectionStatus = "reconnecting";
//         console.log("🔄 Reconnecting...");
//         startWasiConnection();
//       } else {
//         connectionStatus = "logged-out";
//         console.log("❌ Session logged out. Delete creds.json and restart.");
//       }
//     } else if (connection) {
//       connectionStatus = connection;
//     }
//   });

//   sock.ev.on("creds.update", saveCreds);

//   /* --------------------------------------------------------------
//    * Message Handler
//    * ------------------------------------------------------------ */
//   sock.ev.on("messages.upsert", async ({ messages }) => {
//     const m = messages[0];
//     if (!m?.message) return;

//     const remoteJid = m.key.remoteJid;

//     // 1) Status handling (delegated to plugin)
//     if (remoteJid === "status@broadcast" && AUTO_STATUS_VIEW) {
//       await handleStatus(sock, m);  // includes save/forward if enabled in config
//       return; // never treat statuses as commands
//     }

//     // 2) Auto-read normal chats
//     if (AUTO_READ) {
//       try {
//         await sock.sendReadReceipt(remoteJid, [m.key.id]);
//       } catch (err) {
//         console.error("[READ] failed:", err);
//       }
//     }

//     // 3) Store message (for HTTP API)
//     const id = m.key?.id;
//     if (id && !messageStore.has(id)) {
//       messageStore.set(id, { id, jid: remoteJid, message: m.message, raw: m });
//       messageOrder.push(id);
//       if (messageOrder.length > 1000) {
//         const oldest = messageOrder.shift();
//         messageStore.delete(oldest);
//       }
//     }

//     // 4) Extract text for command parsing
//     const text =
//       m.message.conversation ||
//       m.message.extendedTextMessage?.text ||
//       m.message.imageMessage?.caption ||
//       m.message.videoMessage?.caption ||
//       "";
//     const parsed = parseCommand(text);
//     if (!parsed) return;

//     const { usedPrefix, cmdName, args, fullText } = parsed;

//     // 5) Find registered command
//     const command = commands.find(
//       c => c.pattern === cmdName ||
//            (Array.isArray(c.alias) && c.alias.includes(cmdName))
//     );
//     if (!command) return;

//     // 6) Execute command
//     try {
//       await command.function(sock, m, {
//         args,
//         text: fullText,
//         prefix: usedPrefix,
//         cmdName,
//         commandMeta: command
//       });
//     } catch (err) {
//       console.error(`❌ Command Error: ${cmdName}`, err);
//       sock.sendMessage(remoteJid, { text: "❌ Command error." }, { quoted: m }).catch(() => {});
//     }
//   });

//   /* --------------------------------------------------------------
//    * Anti-call
//    * ------------------------------------------------------------ */
//   if (ANTI_CALL) {
//     sock.ev.on("call", async (calls) => {
//       await wasiAntiCallHandler(sock, calls);
//     });
//   }

//   return sock;
// }

// /* ------------------------------------------------------------------
//  * Exports
//  * ---------------------------------------------------------------- */
// module.exports = {
//   startWasiConnection,
//   getSock,
//   getBotStartTime,
//   getConnectionStatus,
//   getMessageById,
//   listRecentMessageIds,
//   messageStore
// };





// const {
//   default: makeWASocket,
//   useMultiFileAuthState,
//   fetchLatestBaileysVersion,
//   DisconnectReason
// } = require("@whiskeysockets/baileys");

// const qrcode = require("qrcode-terminal");
// const pino = require("pino");
// const fs = require("fs");
// const path = require("path");

// const config = require("../config.js");
// const { commands } = require("../lib/command");
// const { parseCommand } = require("../lib/prefix");

// // --- Anti-call handler
// let wasiAntiCallHandler = async () => {};
// try {
//   const evtPath = path.join(__dirname, "..", "lib", "wasiEvents.js");
//   if (fs.existsSync(evtPath)) {
//     const evtMod = require(evtPath);
//     if (typeof evtMod.wasiAntiCallHandler === "function") {
//       wasiAntiCallHandler = evtMod.wasiAntiCallHandler;
//     }
//   }
// } catch (err) {
//   console.warn("⚠ Anti-call handler not loaded:", err);
// }

// // ------------------------------------------------------------------
// // Globals
// // ------------------------------------------------------------------
// const botStartTime = Date.now();
// let currentSock = null;
// let connectionStatus = "starting";
// const messageStore = new Map();
// const messageOrder = [];

// // Helper accessors
// function getSock() { return currentSock; }
// function getBotStartTime() { return botStartTime; }
// function getConnectionStatus() { return connectionStatus; }
// function getMessageById(id) { return messageStore.get(id) || null; }
// function listRecentMessageIds(limit = 50) { return messageOrder.slice(-limit); }

// // Ensure sessions folder exists
// const SESSION_DIR = config.SESSION_DIR
//   ? path.resolve(config.SESSION_DIR)
//   : path.join(__dirname, "..", "sessions");
// if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });

// // ------------------------------------------------------------------
// // Main Connection
// // ------------------------------------------------------------------
// async function startWasiConnection() {
//   console.log(`⏳ [${config.BOT_NAME}] Connecting to WhatsApp...`);

//   const SESSION_TOKEN = (process.env.SESSION_ID || config.SESSION_ID || "").trim();
//   if (SESSION_TOKEN) {
//     console.log("🔑 Using SESSION_ID...");
//     try {
//       const credsJson = Buffer.from(SESSION_TOKEN, "base64").toString("utf-8");
//       JSON.parse(credsJson);
//       fs.writeFileSync(path.join(SESSION_DIR, "creds.json"), credsJson);
//     } catch (err) {
//       console.error("❌ Invalid SESSION_ID. QR will be required.", err);
//     }
//   } else {
//     console.log("📲 No SESSION_ID provided. QR scan will be required.");
//   }

//   const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
//   const { version } = await fetchLatestBaileysVersion();

//   const sock = makeWASocket({
//     version,
//     auth: state,
//     logger: pino({ level: "silent" }),
//     browser: [config.BOT_NAME, "Chrome", "4.0"],
//     printQRInTerminal: false
//   });

//   currentSock = sock;

//   // Connection events
//   sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
//     if (!SESSION_TOKEN && qr) {
//       console.log("📲 Scan this QR to connect:");
//       qrcode.generate(qr, { small: true });
//     }

//     if (connection === "open") {
//       connectionStatus = "open";
//       console.log(`✅ ${config.BOT_NAME} connected as ${sock.user?.id || "unknown"}`);
//       sock.sendMessage(config.OWNER_NUMBER + "@s.whatsapp.net", {
//         text: `✅ *${config.BOT_NAME}* is now online!`
//       }).catch(() => {});
//     } else if (connection === "close") {
//       const reason = lastDisconnect?.error?.output?.statusCode;
//       if (reason !== DisconnectReason.loggedOut) {
//         connectionStatus = "reconnecting";
//         console.log("🔄 Reconnecting...");
//         startWasiConnection();
//       } else {
//         connectionStatus = "logged-out";
//         console.log("❌ Session logged out. Delete creds.json and restart.");
//       }
//     } else if (connection) {
//       connectionStatus = connection;
//     }
//   });

//   sock.ev.on("creds.update", saveCreds);

//   // Auto-view statuses (if enabled)
//   if (config.AUTO_STATUS_VIEW) {
//     sock.ev.on("message-receipt.update", async (receipt) => {
//       if (receipt.key?.remoteJid === "status@broadcast") {
//         try {
//           await sock.readMessages([receipt.key]);
//           console.log("✅ Auto-viewed a status update.");
//         } catch (err) {
//           console.error("Failed to auto-view status:", err);
//         }
//       }
//     });
//   }

//   // Message Handler
//   sock.ev.on("messages.upsert", async ({ messages }) => {
//     const m = messages[0];
//     if (!m?.message) return;

//     // Auto-read (seen) if enabled
//     if (config.AUTO_READ) {
//       try {
//         await sock.sendReadReceipt(m.key.remoteJid, [m.key.id]);
//       } catch (err) {
//         console.error("Failed to mark message as read:", err);
//       }
//     }

//     // Store message
//     const id = m.key?.id;
//     if (id && !messageStore.has(id)) {
//       messageStore.set(id, { id, jid: m.key.remoteJid, message: m.message, raw: m });
//       messageOrder.push(id);
//       if (messageOrder.length > 1000) {
//         messageStore.delete(messageOrder.shift());
//       }
//     }

//     // Extract text
//     const text =
//       m.message.conversation ||
//       m.message.extendedTextMessage?.text ||
//       m.message.imageMessage?.caption ||
//       m.message.videoMessage?.caption ||
//       "";
//     const parsed = parseCommand(text);
//     if (!parsed) return;

//     const { usedPrefix, cmdName, args, fullText } = parsed;
//     const command = commands.find(
//       c => c.pattern === cmdName || (Array.isArray(c.alias) && c.alias.includes(cmdName))
//     );
//     if (!command) return;

//     try {
//       await command.function(sock, m, {
//         args,
//         text: fullText,
//         prefix: usedPrefix,
//         cmdName,
//         commandMeta: command
//       });
//     } catch (err) {
//       console.error(`❌ Error executing command: ${cmdName}`, err);
//       sock.sendMessage(m.key.remoteJid, { text: "❌ Command error." }, { quoted: m }).catch(() => {});
//     }
//   });

//   // Anti-call (configurable)
//   if (config.ANTI_CALL) {
//     sock.ev.on("call", async (calls) => {
//       await wasiAntiCallHandler(sock, calls);
//     });
//   }

//   return sock;
// }

// module.exports = {
//   startWasiConnection,
//   getSock,
//   getBotStartTime,
//   getConnectionStatus,
//   getMessageById,
//   listRecentMessageIds,
//   messageStore
// };























