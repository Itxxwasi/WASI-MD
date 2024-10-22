const {readEnv} = require('../lib/database')
const {cmd , commands} = require('../command')

cmd({
    pattern: "script",
    react: "👑",
    alias: ["sc","repo","info"],
    desc: "get owner number",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
const config = await readEnv();
let madeMenu = `❁ ════ ❃•◯•❃ ════ ❁

*⇆ ʜɪɪ ᴍʏ ᴅᴇᴀʀ ғʀɪᴇɴᴅ ⇆*

     *${pushname}*

❁ ════ ❃•◯•❃ ════ ❁

*ʜᴇʀᴇ ɪs ʙᴏᴛ sᴄʀɪᴘᴛ*

⇩━━━━━━━━❁━━━━━━━━⇩
╭⊱✫🔮 SILENT-SOBX-MD 🔮✫⊱╮
│✫ - *📂ʀᴇᴘᴏsɪᴛᴏʀʏ ɴᴀᴍᴇ:* *sɪʟᴇɴᴛ-sᴏʙx-ᴍᴅ*
│✫ - *📃ᴅᴇsᴄʀɪᴘᴛɪᴏɴ:* *❁ᴡᴏʀʟᴅ ʙᴇsᴛ ᴡʜᴀᴛsᴀᴘᴘ ʙᴏᴛ❁*
│✫ - *🛡️ᴏᴡɴᴇʀ:* *sɪʟᴇɴᴛ ʟᴏᴠᴇʀ⁴³²*
│✫ - *🌐 ᴜʀʟ:* https://github.com/SILENTLOVER4/SILENT-SOBX-MD
╰━━━━━━━━━━━━━━━━━╯
> *❁ᴊᴏɪɴ ᴏᴜʀ ᴡʜᴀᴛsᴀᴘᴘ ᴄʜᴀɴɴᴇʟ ғᴏʀ ᴜᴘᴅᴀᴛᴇs sɪʟᴇɴᴛ-sᴏʙx-ᴍᴅ❁*

*https://whatsapp.com/channel/0029VaHO5B0G3R3cWkZN970s*

> *❁ᴊᴏɪɴ ᴏᴜʀ ʏᴏᴜᴛᴜʙᴇ ᴄʜᴀɴɴᴇʟ ғᴏʀ ᴜᴘᴅᴀᴛᴇs sɪʟᴇɴᴛ-sᴏʙx-ᴍᴅ❁*

*https://youtube.com/@silentlover432?si=n3pYYLvSFLP7Shj7*

❁ ════ ❃•⇆•❃ ════ ❁

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ sɪʟᴇɴᴛ_ʟᴏᴠᴇʀ⁴³²*

╰━❁ ═══ ❃•⇆•❃ ═══ ❁━╯
`

await conn.sendMessage(from,{image:{url:config.ALIVE_IMG},caption:madeMenu},{quoted:mek})

}catch(e){
console.log(e)
reply(`${e}`)
}
})
