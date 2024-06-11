let handler = async(m, { conn, text, usedPrefix, command }) => {

    // Sound
    let name = m.pushName || conn.getName(m.sender)
    var vn = "https://i.imgur.com/bfV3BkA.mp4",
    let url = "https://github.com/Itxxwasi/WASI-MD",
    let murl = "https://youtu.be/@wasitech1",
    let img = "https://i.imgur.com/LVcnnmt.png",
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
          title: "𝐀𝐋𝐈𝐕𝐄 ${botname}",
          body: "𝐖𝐀𝐒𝐈 𝐒𝐄𝐑",
          thumbnailUrl: img,
          sourceUrl: 'https://whatsapp.com/channel/0029VaDK8ZUDjiOhwFS1cP2j',
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
