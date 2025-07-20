const { cmd } = require("../lib/command");
const { getContentType } = require("@whiskeysockets/baileys");

// Utility to check if the sender is an admin
async function isAdmin(sock, jid, user) {
  const metadata = await sock.groupMetadata(jid);
  const participant = metadata.participants.find(p => p.id === user);
  return participant && (participant.admin === "admin" || participant.admin === "superadmin");
}

// Tag all members in a group
cmd(
  {
    pattern: "tagall",
    desc: "Tag all group members.",
    category: "group"
  },
  async (sock, m, { reply }) => {
    const metadata = await sock.groupMetadata(m.key.remoteJid);
    const participants = metadata.participants;

    let mentions = participants.map(p => p.id);
    let message = "👥 *Group Members:*\n\n";
    for (const p of participants) {
      message += `• @${p.id.split("@")[0]}\n`;
    }

    await sock.sendMessage(m.key.remoteJid, { text: message, mentions }, { quoted: m });
  }
);

// Add a user to the group
cmd(
  {
    pattern: "add",
    desc: "Add a user to the group.",
    category: "group"
  },
  async (sock, m, { args, reply }) => {
    if (!m.key.remoteJid.endsWith("@g.us")) return reply("❌ This command can only be used in groups!");
    const sender = m.key.participant || m.key.remoteJid;
    if (!(await isAdmin(sock, m.key.remoteJid, sender))) return reply("❌ You must be a group admin!");

    if (!args[0]) return reply("❌ Provide a number to add!\n\nExample: `.add 923001234567`");
    const number = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    try {
      await sock.groupParticipantsUpdate(m.key.remoteJid, [number], "add");
      reply(`✅ User added: @${args[0]}`);
    } catch (e) {
      reply("❌ Failed to add user. They may have privacy settings enabled.");
    }
  }
);

// Kick a user from the group
cmd(
  {
    pattern: "kick",
    desc: "Kick a user from the group.",
    category: "group"
  },
  async (sock, m, { args, reply }) => {
    if (!m.key.remoteJid.endsWith("@g.us")) return reply("❌ This command can only be used in groups!");
    const sender = m.key.participant || m.key.remoteJid;
    if (!(await isAdmin(sock, m.key.remoteJid, sender))) return reply("❌ You must be a group admin!");

    let target;
    if (m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      target = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (args[0]) {
      target = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    } else return reply("❌ Mention or provide a number to kick!");

    try {
      await sock.groupParticipantsUpdate(m.key.remoteJid, [target], "remove");
      reply(`🚫 User removed: @${target.split("@")[0]}`);
    } catch (e) {
      reply("❌ Failed to remove user.");
    }
  }
);

// Promote a user to admin
cmd(
  {
    pattern: "promote",
    desc: "Promote a user to admin.",
    category: "group"
  },
  async (sock, m, { args, reply }) => {
    if (!m.key.remoteJid.endsWith("@g.us")) return reply("❌ This command can only be used in groups!");
    const sender = m.key.participant || m.key.remoteJid;
    if (!(await isAdmin(sock, m.key.remoteJid, sender))) return reply("❌ You must be a group admin!");

    let target;
    if (m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      target = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (args[0]) {
      target = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    } else return reply("❌ Mention or provide a number to promote!");

    try {
      await sock.groupParticipantsUpdate(m.key.remoteJid, [target], "promote");
      reply(`⬆️ User promoted: @${target.split("@")[0]}`);
    } catch (e) {
      reply("❌ Failed to promote user.");
    }
  }
);

// Demote a user from admin
cmd(
  {
    pattern: "demote",
    desc: "Demote a user from admin.",
    category: "group"
  },
  async (sock, m, { args, reply }) => {
    if (!m.key.remoteJid.endsWith("@g.us")) return reply("❌ This command can only be used in groups!");
    const sender = m.key.participant || m.key.remoteJid;
    if (!(await isAdmin(sock, m.key.remoteJid, sender))) return reply("❌ You must be a group admin!");

    let target;
    if (m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      target = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (args[0]) {
      target = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    } else return reply("❌ Mention or provide a number to demote!");

    try {
      await sock.groupParticipantsUpdate(m.key.remoteJid, [target], "demote");
      reply(`⬇️ User demoted: @${target.split("@")[0]}`);
    } catch (e) {
      reply("❌ Failed to demote user.");
    }
  }
);
