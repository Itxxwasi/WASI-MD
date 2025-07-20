// server.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const config = require("./config.js");
const {
  getSock,
  getBotStartTime,
  getConnectionStatus,
  getMessageById,
  listRecentMessageIds,
} = require("./mainwasi/connection");
const {
  downloadContentFromMessage,
  getContentType,
} = require("@whiskeysockets/baileys");

// Optional: access to registered commands
const { listCommands } = require("./lib/command");

// ------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------
const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const PORT = process.env.PORT || config.SERVER_PORT || 3000;
const HOST = process.env.HOST || config.SERVER_HOST || "0.0.0.0";

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

function getUptime() {
  // process.uptime() is usually sufficient, but we track start for clarity
  const started = getBotStartTime();
  return Date.now() - started;
}

// ------------------------------------------------------------------
// Routes
// ------------------------------------------------------------------

// Health
app.get("/", (req, res) => {
  res.json({
    bot: config.BOT_NAME,
    status: getConnectionStatus(),
    uptime_ms: getUptime(),
    uptime_human: formatDuration(getUptime()),
    prefix: config.PREFIX,
  });
});

// Uptime only
app.get("/uptime", (req, res) => {
  res.json({
    uptime_ms: getUptime(),
    uptime_human: formatDuration(getUptime()),
  });
});

// Commands
app.get("/commands", (req, res) => {
  const items = listCommands().map((c) => ({
    pattern: c.pattern,
    alias: c.alias,
    desc: c.desc,
    category: c.category,
  }));
  res.json({ count: items.length, commands: items });
});

// Send message
app.post("/send-message", async (req, res) => {
  const { jid, text } = req.body;
  if (!jid || !text) {
    return res.status(400).json({ error: "jid and text required" });
  }
  const sock = getSock();
  if (!sock) return res.status(503).json({ error: "socket not ready" });

  try {
    await sock.sendMessage(jid, { text: String(text) });
    res.json({ success: true });
  } catch (err) {
    console.error("send-message error:", err);
    res.status(500).json({ error: "send failed" });
  }
});

// List recent messages (IDs only)
app.get("/messages", (req, res) => {
  const limit = Number(req.query.limit || 50);
  const ids = listRecentMessageIds(limit);
  res.json({ count: ids.length, ids });
});

// Get message meta
app.get("/messages/:id", (req, res) => {
  const meta = getMessageById(req.params.id);
  if (!meta) return res.status(404).json({ error: "not found" });
  res.json({
    id: meta.id,
    jid: meta.jid,
    hasMessage: !!meta.message,
    messageType: getContentType(meta.message) || null,
    raw: meta.raw, // full Baileys structure (can be large)
  });
});

// Download media by message ID
app.get("/media/:id", async (req, res) => {
  const meta = getMessageById(req.params.id);
  if (!meta) return res.status(404).json({ error: "message not found" });

  const msg = meta.message;
  const mtype = getContentType(msg);
  if (!mtype) return res.status(400).json({ error: "no media type detected" });

  // Allowed types that have media streams
  const mediaBearing = [
    "imageMessage",
    "videoMessage",
    "audioMessage",
    "documentMessage",
    "stickerMessage",
  ];
  if (!mediaBearing.includes(mtype)) {
    return res
      .status(400)
      .json({ error: `message type ${mtype} has no downloadable media` });
  }

  try {
    const mediaMsg = msg[mtype];
    const stream = await downloadContentFromMessage(
      mediaMsg,
      mtype.replace("Message", ""),
    );
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    // Basic mime fallback
    const mime = mediaMsg.mimetype || "application/octet-stream";
    res.setHeader("Content-Type", mime);
    res.setHeader("Content-Length", buffer.length);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${req.params.id}"`,
    );
    res.send(buffer);
  } catch (err) {
    console.error("media download error:", err);
    res.status(500).json({ error: "download failed" });
  }
});

// ------------------------------------------------------------------
// Start server
// ------------------------------------------------------------------
function startWasiServer() {
  app.listen(PORT, HOST, () => {
    console.log(`🌐 WASI-MD-V3 HTTP server running at http://${HOST}:${PORT}`);
  });
}

module.exports = { startWasiServer };
