
import yts from 'youtube-yts'
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'
let limit = 320
let handler = async (m, { conn, text, args, isPrems, isOwner, usedPrefix, command }) => {
  
    if (!text) throw `✳️ Enter query \n📌Exemple *${usedPrefix + command}* Aya hai bulawa Mustafa Raza Qadri`
  let chat = global.db.data.chats[m.chat]
  let res = await yts(text)
  //let vid = res.all.find(video => video.seconds < 3600)
  let vid = res.videos[0]
  if (!vid) throw `✳️ Video/Audio couldn't found`
  let isVideo = /vid$/.test(command)
  m.react('🎧') 
  
  try {
  let q = isVideo ? '360p' : '128kbps' 
  let v = vid.url
  let yt = await youtubedl(v).catch(async () => await youtubedlv2(v))
  let dl_url = await (isVideo ? yt.video[q].download() : yt.audio[q].download())
  let title = await yt.title
  let size = await (isVideo ? yt.video[q].fileSizeH : yt.audio[q].fileSizeH)
  let play = `
	≡ *PRINCE MUSIC*
┌──────────────
▢ 📌 *Title* : ${vid.title}
▢ 📆 *Published:* ${vid.ago}
▢ ⌚ *Duration:* ${vid.timestamp}
▢ 👀 *Views:* ${vid.views}
└──────────────

*Downloading...* `
conn.sendFile(m.chat, vid.thumbnail, 'play', play, m, null, rpig)

if (size.split('MB')[0] >= limit) return m.reply(` ≡  *PRINCE YTDL*\n\n▢ *⚖️Size* : ${size}\n▢ *🎞️Pixel* : ${q}\n\n▢ _The file exceeded the limit*+${limit} MB*`) 
if (size.includes('GB')) return m.reply(` ≡  *PRINCE YTDL*\n\n▢ *⚖️Size* : ${size}\n▢ *🎞️Pixel* : ${q}\n\n▢ _The file exceeded the limit_ *+${limit} MB*`)   
	  conn.sendFile(m.chat, dl_url, title + '.mp' + (3 + /vid$/.test(command)), `
 ≡  *PRINCE YTDL*
  
▢ *📌Title* : ${title}
▢ *🎞️Pixel* : ${q}
▢ *⚖️Size* : ${size}
`.trim(), m, false, { mimetype: isVideo ? '' : 'audio/mpeg', asDocument: chat.useDocument })
		m.react(done) 
    } catch {
		m.reply(`❎Error while downloading...`)
    }

}
handler.help = ['play']
handler.tags = ['downloader']
handler.command = ['playa', 'playv']

export default handler
