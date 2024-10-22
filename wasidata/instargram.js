const {cmd , commands} = require('../command');
cmd({
    pattern: "insta",
    desc: "To download instagram videos.",
    category: "download",
    react: "📩",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

  if (!args[0]) {
    return reply('*`Please give me a valid instagram link.`*');
  }

  await m.react('📥');
  let res;
  try {
    res = await igdl(args[0]);
  } catch (error) {
    return reply('*`Error Obtaning Data.`*');
  }

  let result = res.data;
  if (!result || result.length === 0) {
    return reply('*`No results found.`*');
  }

  let data;
  try {
    data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
  } catch (error) {
    return reply('*`error data loss.`*');
  }

  if (!data) {
    return reply('*`ησ ∂αтα ƒσυη∂.`*');
  }

  await m.react('⚡');
  let video = data.url;
  let dev = '*🧬SILENT-SOBX-MD INSTAGRAM DOWNLOAD*'
  
  try {
    await conn.sendMessage(m.chat, { video: { url: video }, caption: dev, fileName: 'ig.mp4', mimetype: 'video/mp4' }, { quoted: m });
  } catch (error) {
    return reply('*`Error Download Video`*');
  await m.react('❌');
  }
}catch(e){
console.log(e)
  reply(`${e}`)
}
});
