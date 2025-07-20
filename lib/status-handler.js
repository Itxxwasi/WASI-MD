// lib/status-handler.js
const fs = require("fs");
const path = require("path");
const { downloadContentFromMessage, getContentType } = require("@whiskeysockets/baileys");
const config = require("../config.js");

// Directory to save statuses
const SAVE_DIR = config.STATUS_SAVE_DIR || path.join(__dirname, "..", "saved-status");
if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR, { recursive: true });

// JIDs to forward statuses
const FORWARD_JIDS = (config.STATUS_FORWARD_JIDS && config.STATUS_FORWARD_JIDS.length)
  ? config.STATUS_FORWARD_JIDS.map(jid => jid.includes("@") ? jid : `${jid}@s.whatsapp.net`)
  : [`${config.OWNER_NUMBER}@s.whatsapp.net`];

function getExtension(mimetype) {
  if (!mimetype) return "bin";
  const ext = mimetype.split("/")[1];
  return ext === "jpeg" ? "jpg" : ext;
}

async function downloadMedia(msgNode, type) {
  const stream = await downloadContentFromMessage(msgNode, type);
  let buffer = Buffer.from([]);
  for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
  return buffer;
}

/**
 * Handles status messages
 * @param {Object} sock - The WhatsApp socket instance
 * @param {Object} m - The incoming message object
 */
async function handleStatus(sock, m) {
  try {
    if (!config.AUTO_STATUS_VIEW) return;

    // Auto-view status
    await sock.readMessages([m.key]);
    console.log(`👀 Auto-viewed status: ${m.key.id}`);

    // Only save images/videos
    const mtype = getContentType(m.message);
    if (!["imageMessage", "videoMessage"].includes(mtype)) return;

    // Download media
    const msgNode = m.message[mtype];
    const buffer = await downloadMedia(msgNode, mtype.replace("Message", ""));
    const filename = `${Date.now()}_${m.key.id}.${getExtension(msgNode.mimetype)}`;
    const filePath = path.join(SAVE_DIR, filename);
    fs.writeFileSync(filePath, buffer);

    // Prepare message payload
    const caption = `🟢 Status from ${m.pushName || m.key.participant}`;
    const payload = mtype === "imageMessage"
      ? { image: buffer, caption }
      : { video: buffer, caption, mimetype: msgNode.mimetype || "video/mp4" };

    // Forward to all configured JIDs
    for (const jid of FORWARD_JIDS) {
      await sock.sendMessage(jid, payload).catch(console.error);
    }

    // Clean up
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Status handler error:", err);
  }
}

module.exports = { handleStatus };
