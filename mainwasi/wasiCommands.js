const config = require("../config");

async function wasiAliveCmd(sock, chatId) {
  await sock.sendMessage(chatId, {
    text: `✅ *${config.BOT_NAME}* is alive!\nPrefix: ${config.PREFIX}`
  });
}

async function wasiPingCmd(sock, chatId) {
  const start = Date.now();
  await sock.sendMessage(chatId, { text: "🏓 Pinging..." });
  const end = Date.now();
  const latency = end - start;
  await sock.sendMessage(chatId, { text: `⏳ Ping: *${latency}ms*` });
}

module.exports = { wasiAliveCmd, wasiPingCmd };
