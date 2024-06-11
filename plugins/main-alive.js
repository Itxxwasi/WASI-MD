let handler = async(m, { conn, text, usedPrefix, command }) => {

    // Sound
    let name = m.pushName || conn.getName(m.sender)
    var vn = "https://github.com/Itxxwasi/WASI-MD/raw/main/Assets/mp3/alive.mp3"
    let url = "https://github.com/Itxxwasi/WASI-MD"
    let murl = "https://youtube.com/@wasitech1"
    let img = "https://telegra.ph/file/e4e5a6722c1d5bf8ba1a5.jpg"
    let con = { key: { fromMe: false, participant: `${m.sender.split`@`[0]}@s.whatsapp.net`, ...(m.chat ? { remoteJid: '16504228206@s.whatsapp.net' } : {}) }, message: { contactMessage: { displayName: `${name}`, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}}
    let doc = {
        audio: {
          url: vn
        },
        mimetype: 'audio/mp4',
        ptt: true,
        waveform:  [100, 0, 100, 0, 100, 0, 100],
        fileName: "Guru",
    
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
          title: "ᴡʜᴀᴛsᴀᴘᴘ ʙᴏᴛ ɪs ᴀʟɪᴠᴇ",
          body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴡᴀsɪ ᴛᴇᴄʜ",
          thumbnailUrl: img,
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: true
          }}
      };
    
      await conn.sendMessage(m.chat, doc, { quoted: con });
    
    }
    
    handler.help = ['alive']
    handler.tags = ['main']
    handler.command = /^(alive)$/i 

    export default handler;
