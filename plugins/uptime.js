// plugins/uptime.js
const { cmd } = require("../lib/command");

cmd(
  {
    pattern: "uptime",
    desc: "Shows how long the bot has been running",
    category: "system"
  },
  async (sock, m) => {
    const uptime = process.uptime() * 1000; // uptime in ms

    // Convert uptime to HH:MM:SS
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((uptime % (1000 * 60)) / 1000);

    const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

    await sock.sendMessage(m.key.remoteJid, { text: `⏱ *Uptime:* ${uptimeStr}` }, { quoted: m });
  }
);
