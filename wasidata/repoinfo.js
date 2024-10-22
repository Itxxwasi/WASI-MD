const axios = require('axios');
const { cmd, commands } = require('../command');

cmd({
    pattern: "srepo",
    desc: "Fetch information about a GitHub repository.",
    category: "other",
    react: "🍃",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const repo = args.join(' ');
        if (!repo) {
            return reply("Please provide a GitHub repository name in the format 📌`owner/repo`.");
        }

        const apiUrl = `https://api.github.com/repos/${repo}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        let repoInfo = `📁_*GITHUB REPOSITORY INFO BY SILENT-SOBX-MD*_📁\n\n`;
        repoInfo += `📌 *ɴᴀᴍᴇ*: ${data.name}\n`;
        repoInfo += `🔗 *ᴜʀʟ*: ${data.html_url}\n`;
        repoInfo += `📝 *ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ*: ${data.description}\n`;
        repoInfo += `⭐ *ꜱᴛᴀʀꜱ*: ${data.stargazers_count}\n`;
        repoInfo += `🍴 *ꜰᴏʀᴋꜱ*: ${data.forks_count}\n`;
        repoInfo += `\n`;
        repoInfo += `*SILENT-SOBX-MD CREATION*\n`;

        await conn.sendMessage(from, { text: repoInfo }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error fetching repository data🤕: ${e.message}`);
    }
});

