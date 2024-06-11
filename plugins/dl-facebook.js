
import fg from 'api-dylux' 
let handler = async (m, { conn, args, usedPrefix, command }) => {
 if (!args[0] && m.quoted && m.quoted.text) {
  args[0] = m.quoted.text;
}
if (!args[0] && !m.quoted) throw `✳️ Provide a Facebook link first \n📌 Example:\n*${usedPrefix + command}* https://www.facebook.com/...`
    m.react(rwait)
   try {
    let result = await fg.fbdl(args[0]);
    let tex = `
┌─⊷ *⚪PRINCE FBDL⚪*
▢ *Title:* ${result.title}
└───────────`;
    conn.sendFile(m.chat, result.videoUrl, 'fb.mp4', tex, m);
    m.react(done);
  } catch (error) {
 	m.reply('❎Enter a proper facebook link ')
 	} 
}
handler.help = ['facebook'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^((facebook|fb)(downloder|dl)?)$/i
handler.diamond = false

export default handler
