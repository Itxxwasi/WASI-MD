const { cmd } = require("../lib/command");

cmd(
  {
    pattern: "debug",
    desc: "Show debug info about the last message.",
    category: "system",
  },
  async (sock, m) => {
    const info = JSON.stringify(m, null, 2);
    await sock.sendMessage(m.key.remoteJid, { text: "```" + info + "```" }, { quoted: m });
  }
);
