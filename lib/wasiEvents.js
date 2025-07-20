// lib/wasiEvents.js
/**
 * Anti-call handler for WASI-MD-V3
 * Rejects incoming WhatsApp calls (voice/video) and sends an auto-reply.
 */

const config = require("../config.js");

/**
 * Reject incoming calls & notify the caller.
 * @param {import("@whiskeysockets/baileys").WASocket} sock
 * @param {Array<Object>} calls - Array of call event objects from Baileys
 */
async function wasiAntiCallHandler(sock, calls = []) {
  try {
    // Accept these as truthy: true, "true", 1
    const antiCallEnabled =
      config.ANTI_CALL === true ||
      config.ANTI_CALL === "true" ||
      config.ANTI_CALL === 1;

    if (!antiCallEnabled) return;

    for (const call of calls) {
      // Baileys emits a call per array element
      if (call.status !== "offer") continue; // only when call starts

      const jid = call.from;
      const id = call.id;

      // Try to reject call (API can differ by version; attempt both styles)
      try {
        if (typeof sock.rejectCall === "function") {
          // Some versions expect (id, from)
          await sock.rejectCall(id, jid);
        } else if (sock?.ws?.send) {
          // Fallback: ignore silently
        }
      } catch (err) {
        console.error("wasiAntiCallHandler reject error:", err);
      }

      // Notify caller
      const msg =
        config.REJECT_MSG ||
        "*📵 Calls are not allowed. Please send a message instead.*";
      try {
        await sock.sendMessage(jid, { text: msg });
      } catch (err) {
        console.error("wasiAntiCallHandler notify error:", err);
      }
    }
  } catch (err) {
    console.error("wasiAntiCallHandler fatal error:", err);
  }
}

module.exports = { wasiAntiCallHandler };
