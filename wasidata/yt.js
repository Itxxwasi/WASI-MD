const config = require('../config')
const l = console.log
const { cmd, commands } = require('../command')
const dl = require('@bochilteam/scraper')  
const ytdl = require('yt-search');
const fs = require('fs-extra')
var videotime = 60000 // 1000 min
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
cmd({
    pattern: "yts",
    alias: ["ytsearch"],
    use: '.yts sameer kutti',
    react: "🔎",
    desc: "Search and get details from youtube.",
    category: "search",
    filename: __filename

},

async(conn, mek, m,{from, l, quoted, body, isCmd, umarmd, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if (!q) return reply('*Please give me words to search*')
try {
let yts = require("yt-search")
var arama = await yts(q);
} catch(e) {
    l(e)
return await conn.sendMessage(from , { text: '*Error !!*' }, { quoted: mek } )
}
var mesaj = '';
arama.all.map((video) => {
mesaj += ' *🖲️' + video.title + '*\n🔗 ' + video.url + '\n\n'
});
await conn.sendMessage(from , { text:  mesaj }, { quoted: mek } )
} catch (e) {
    l(e)
  reply('*Error !!*')
}
})

cmd({
    pattern: "video",
    alias: ["ytvideo","ytv","drama"],
    use: '.video sameer kanjr',
    react: "📽️",
    desc: "Search & download yt videos.",
    category: "download",
    filename: __filename

},

async(conn, mek, m,{from, l, quoted, body, isCmd, darkneo, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if (!q) return reply('*Please give me quary to download*')
let yts = require("yt-search")
let search = await yts(q)
let anu = search.videos[0]
const cap = `*SILENT-SOBX-MD VIDEO DOWNLOADER 🛜*
*TITLE: ${anu.title}*

🔗𝐔𝐑𝐋 : ${anu.url}

🌐𝐃𝐔𝐑𝐀𝐓𝐈𝐎𝐍 : ${anu.timestamp}

📟𝐕𝐈𝐄𝐖𝐒: ${anu.views}


*sɪʟᴇɴᴛ-sᴏʙx-ᴍᴅ ʙᴏᴛ ᴄʀᴇᴀᴛᴇᴅ ʙʏ sɪʟᴇɴᴛʟᴏᴠᴇʀ⁴³²*

*ᴊᴏɪɴ ғᴏʀ sɪʟᴇɴᴛ-sᴏʙx-ᴍᴅ ᴜᴘᴅᴀᴛᴇs*

*https://whatsapp.com/channel/0029VaHO5B0G3R3cWkZN970s*

❁❁❁❁❁❁❁❁❁❁❁❁❁❁❁❁❁❁`
await conn.sendMessage(from, { image: { url: anu.thumbnail }, caption: cap}, { quoted: mek })
const yt = await dl.youtubedl(anu.url).catch(async () => await dl.youtubedlv2(anu.url)) 
const yt2 = await dl.youtubedlv2(anu.url)
if (yt2.video['360p'].fileSizeH.includes('MB') && yt2.video['360p'].fileSizeH.replace(' MB','') >= config.MAX_SIZE) return await conn.sendMessage(from, { text: '*This video too big !!*' }, { quoted: mek });
if (yt2.video['360p'].fileSizeH.includes('GB')) return await conn.sendMessage(from, { text: '*This video too big !!*' }, { quoted: mek });
let senda = await conn.sendMessage(from, { video: {url: await yt.video['360p'].download() }, caption: '*VIDEO BY SILENT-SOBX-MD*'}, { quoted: mek })  
await conn.sendMessage(from, { react: { text: '🎥', key: senda.key }})

if (yt2.video['720p'].fileSizeH.includes('MB') && yt2.video['720p'].fileSizeH.replace(' MB','') >= config.MAX_SIZE) return await conn.sendMessage(from, { text: '*This video too big !!*' }, { quoted: mek });
if (yt2.video['720p'].fileSizeH.includes('GB')) return await conn.sendMessage(from, { text: '*This video too big !!*' }, { quoted: mek });
let senda1 = await conn.sendMessage(from, { video: {url: await yt.video['720p'].download() }, caption: '> ᴠɪᴅᴇᴏ ʙʏ sɪʟᴇɴᴛ-sᴏʙx-ᴍᴅ ʙᴏᴛ ✅'}, { quoted: mek })  
await conn.sendMessage(from, { react: { text: '🎥', key: senda1.key }})

await conn.sendMessage(from, { react: { text: '✅', key: mek.key }})
    
} catch (e) {
  reply("*Not Found !*")
  l(e)
}
})

cmd({
    pattern: "play",
    alias: ["yta","song"],
    use: '.play koun umar',
    react: "🎧",
    desc: "Search & download yt song.",
    category: "download",
    filename: __filename
},

async(conn, mek, m,{from, l, quoted, body, isCmd, darkneo, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if (!q) return reply('Please give me quary to download')
let yts = require("yt-search")
let search = await yts(q)
let anu = search.videos[0]
const cap = `*SILENT-SOBX-MD MUSIC DOWNLOADER 🛜*

TITLE: ${anu.title}

🔗𝐔𝐑𝐋 : ${anu.url}

🌐𝐃𝐔𝐑𝐀𝐓𝐈𝐎𝐍 : ${anu.timestamp}

📟𝐕𝐈𝐄𝐖𝐒: ${anu.views}


*sɪʟᴇɴᴛ-sᴏʙx-ᴍᴅ ʙᴏᴛ ᴄʀᴇᴀᴛᴇᴅ ʙʏ sɪʟᴇɴᴛʟᴏᴠᴇʀ⁴³²*

*ᴊᴏɪɴ ғᴏʀ sɪʟᴇɴᴛ-sᴏʙx-ᴍᴅ ᴜᴘᴅᴀᴛᴇs*

*https://whatsapp.com/channel/0029VaHO5B0G3R3cWkZN970s*

❁❁❁❁❁❁❁❁❁❁❁❁❁❁❁❁❁❁`
await conn.sendMessage(from, { image: { url: anu.thumbnail }, caption: cap}, { quoted: mek })
const yt2 = await dl.youtubedl(anu.url)
if (yt2.audio['128kbps'].fileSizeH.includes('MB') && yt2.audio['128kbps'].fileSizeH.replace(' MB','') >= config.MAX_SIZE) return await conn.sendMessage(from, { text: '*This video too big !!*' }, { quoted: mek });
var du = await yt2.audio['128kbps'].download()
    let senda =  await conn.sendMessage(from, { document: { url : du }, mimetype: 'audio/mpeg', fileName: yt2.title + '.mp3',caption: '> ᴍᴜsɪᴄ ʙʏ sɪʟᴇɴᴛ-sᴏʙx-ᴍᴅ ʙᴏᴛ ✅' }, { quoted: mek })
    await conn.sendMessage(from, { react: { text: '🎼', key: senda.key }})
    
await conn.sendMessage(from, { react: { text: '✅', key: mek.key }})

} catch (e) {
  reply("ERROR ")
  l(e)
}
})
