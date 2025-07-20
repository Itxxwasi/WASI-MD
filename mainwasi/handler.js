const config = require("../config");
const { wasiAliveCmd, wasiPingCmd } = require("./wasiCommands");

async function wasiMessageHandler(sock, m) {
  const from = m.key.remoteJid;
  const sender = m.key.participant || m.key.remoteJid;
  const textMsg = m.message?.conversation || m.message?.extendedTextMessage?.text || "";

  if (!textMsg) return;

  // ✅ Check prefix
  if (!textMsg.startsWith(config.PREFIX)) return;

  const [cmd, ...args] = textMsg.slice(config.PREFIX.length).trim().split(/\s+/);
  const command = cmd.toLowerCase();

  console.log(`📩 Command: ${command} from ${sender}`);

  switch (command) {
    case "alive":
      return await wasiAliveCmd(sock, from);
    case "ping":
      return await wasiPingCmd(sock, from);
    default:
      await sock.sendMessage(from, { text: `❌ Unknown command *${command}*` });
  }
}

module.exports = { wasiMessageHandler };
