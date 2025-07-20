// plugins/menu.js
const { cmd, listCommands } = require("../lib/command");

cmd(
  {
    pattern: "menu",
    desc: "Show all available commands",
    category: "system"
  },
  async (sock, m) => {
    const commandList = listCommands();

    // Group commands by category
    const categories = {};
    commandList.forEach(c => {
      if (!categories[c.category]) categories[c.category] = [];
      categories[c.category].push(c.pattern);
    });

    // Build menu text
    let menuText = `*📜 WASI-MD-V3 Command Menu*\n\n`;
    for (const cat of Object.keys(categories)) {
      menuText += `*${cat.toUpperCase()}*\n`;
      menuText += categories[cat].map(cmd => `• ${cmd}`).join("\n");
      menuText += `\n\n`;
    }
    menuText += `*Prefix:* ${require("../config").PREFIX}`;

    await sock.sendMessage(m.key.remoteJid, { text: menuText }, { quoted: m });
  }
);
