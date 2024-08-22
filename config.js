import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'

//Owner Numbers 
global.owner = [
  ['923135673658', 'wasi', false],
  [''], 
  [''],
]

//global.pairingNumber = "" //put your bot number here
global.mods = ['923192173398'] 
global.prems = ['923192173398', '923192173398', '923192173398']
global.allowed = ['923192173398']
global.keysZens = ['c2459db922', '37CC845916', '6fb0eff124']
global.keysxxx = keysZens[Math.floor(keysZens.length * Math.random())]
global.keysxteammm = ['29d4b59a4aa687ca', '5LTV57azwaid7dXfz5fzJu', 'cb15ed422c71a2fb', '5bd33b276d41d6b4', 'HIRO', 'kurrxd09', 'ebb6251cc00f9c63']
global.keysxteam = keysxteammm[Math.floor(keysxteammm.length * Math.random())]
global.keysneoxrrr = ['5VC9rvNx', 'cfALv5']
global.keysneoxr = keysneoxrrr[Math.floor(keysneoxrrr.length * Math.random())]
global.lolkeysapi = ['GataDios']

global.APIs = { // API Prefix
  // name: 'https://website'
  xteam: 'https://api.xteam.xyz', 
  nrtm: 'https://fg-nrtm.ddns.net',
  bg: 'http://bochil.ddns.net',
  fgmods: 'https://api.fgmods.xyz'
}
global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  'https://api.xteam.xyz': 'd90a9e986e18778b',
  'https://zenzapis.xyz': '675e34de8a', 
  'https://api.fgmods.xyz': 'dEBWvxCY'
}

// Sticker WM
global.botname = '𝗪𝗔𝗦𝗜-𝗠𝗗'
global.princebot = '🛡️𝗪𝗔𝗦𝗜 𝗧𝗘𝗖𝗛🛡️'
global.packname = '𝗪𝗔𝗦𝗜♥️' 
global.author = '𝗧𝗘𝗖𝗛♥️' 
global.princeig = 'https://www.instagram.com' 
global.princegp = 'https://whatsapp.com/channel/0029VaDK8ZUDjiOhwFS1cP2j'
global.menuvid = 'https://i.imgur.com/0UK6D3b.mp4'
global.Princesc = 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWUp2YlgzRDMzYmxNemh4dUYxK2k1VGx4VnB0WUYxZ25BeXpkVWdnUmZIOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOE9mbmVFN3k3eDMwREkrTGNKOVZIb3czRVNpSm1BaXNUYXdGMURpOHZYcz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIwTUcvYUJKTW1TaDdRdmYxZ0pSNEM0VW55NmxXRWtaL3p0WW0yeVNEcjN3PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJTU1Y4R0ZITTIzZ0p4WEprRHNsd0JaRnYwZVpUYkI3SVVZa3VMNlZaWnhBPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImVFSE1rTXBDd0E2T1UwUkliYWduOVJuUzVFdzk1M1FFeUJJWUw0VjM2RVk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImY4cDZrbzd2SFE2NWhoMlNlNkFPcElSSVdHRHdFaEk3VHBPcjI4YU9QbWM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNE44clpUVlBxWmRYMnV2K3AyVjhPbEovOW91TGVheTd1UytueStOa29FUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVmNJMFQ0WGNCdWpTVTN3VlkvQ0VPTVFySkxSR3FtcDVEKzB0SU9SblFsbz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik9uV241dDkvVTRDVlVjVlUvZEFMM2VHL0tuWnE2OGt0U0UxdzZDY1liL3RYRkIzUlhKS2JpdVQwVlM5T0hOSDJ1eEUvNTNlWndvZHJRMElFWWJsM2pnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjAxLCJhZHZTZWNyZXRLZXkiOiIyVkxCY1ZRWFplSzBydHAyRlNndE5yVmFETUQ5MFdpdTJUMzhmdmZXSk9vPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6Ijk0NzIzMjE0NDc0QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IjNFQkY5MTc0NDczQzBCQzZDMEUxQTk3RUNDMzY2MkE0In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3MjQzMTI4NTF9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6ImFhR2hWOHVuVHdHbnpyOEN5U2dCSmciLCJwaG9uZUlkIjoiZTFmNTgxM2EtMWRkZS00YWNlLTk0YWUtY2U2NjA3NjBhZTM2IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IktONmNtMjAvL1hyWXQzODNJVm9CemZKc0t5RT0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJTZ2c5YXdNWlJMOGdUYnhoTVd6RlQvRkE3czQ9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiUE5BR0NaMVYiLCJtZSI6eyJpZCI6Ijk0NzIzMjE0NDc0OjRAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoi4LaF4LeQ4La74LeS4La64LeD4LeKIOC2tOC3meC3j+C2qeC3iuC2qeC3jyJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT1gvZ20wUSs5bWJ0Z1lZQVNBQUtBQT0iLCJhY2NvdW50U2lnbmF0dXJlS2V5Ijoic2pFZXRSb0YwNGhoMTFPa0huOUlkbXgwbEJNZjlaZHdqbUY0ZjhQM3hDaz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiT243ekVZOVZQYUZ3a2lZQWpNY21jdG8wNm5zMWZ0aTAxMUQwZ2JBcmpEM0dRYUhsNkx3d1VUSTlpVVRwMzg2Uy9HTFArdUxIK2VJd0cyQUZCNUxVQnc9PSIsImRldmljZVNpZ25hdHVyZSI6IkprdVc3LzYzcVNIMEE3TFFkekdhMDN6amhGRG9jQk91bGZEbWZJclY1RDhITzAwVFo1dk9xSlR0M3dCZjFYaVNYTHJQVGRvaHF2ZXNYRGhlNUt0ZGlRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTQ3MjMyMTQ0NzQ6NEBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJiSXhIclVhQmRPSVlkZFRwQjUvU0hac2RKUVRIL1dYY0k1aGVIL0Q5OFFwIn19XSwicGxhdGZvcm0iOiJzbWJhIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzI0MzEyODQ2LCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUkvQyJ9'
global.princeyt = 'https://youtube.com/@wasitech1'
global.Princelog = 'https://i.imgur.com/ujxeU8g.jpeg'
global.thumb = fs.readFileSync('./Assets/wasi.png')

global.wait = '*♻️ _ʟᴏᴅɪɴɢ ᴘʟᴢ ᴡᴀɪᴛ ᴅᴇᴀʀ _*\n*▰▰▰▱▱▱▱▱*'
global.imgs = '*🖼️ _𝙶𝙴𝚃𝚃𝙸𝙽𝙶 𝚈𝙾𝚄𝚁 ɪᴍᴀɢᴇs 𝚆𝙰𝙸𝚃..._*\n*▰▰▰▱▱▱▱▱*'
global.rwait = '♻️'
global.dmoji = '🤭'
global.done = '✅'
global.error = '❌' 
global.xmoji = '🌀' 

global.multiplier = 69 
global.maxwarn = '2' // máxima advertencias

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
