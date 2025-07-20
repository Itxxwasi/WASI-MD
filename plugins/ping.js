const { cmd } = require("../lib/command");

cmd(
  {
    pattern: "ping",
    desc: "Check if bot is alive and show latency",
    category: "system",
  },
  async (sock, m) => {
    const start = Date.now();

    // Send a temporary "Pinging..." message
    const sent = await sock.sendMessage(
      m.key.remoteJid,
      { text: "Pinging..." },
      { quoted: m }
    );

    // Calculate latency
    const latency = Date.now() - start;

    // Edit the message (if supported) or send a new one
    await sock.sendMessage(
      m.key.remoteJid,
      { text: `Pong! 🏓 Latency: *${latency}ms*` },
      { quoted: m }
    );
  },
);
