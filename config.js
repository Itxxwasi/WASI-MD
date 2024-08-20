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
global.Princesc = 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMk1kZWNnUkt0TDBkS0IvNHlKUkp2bDBDbUZpK1dwWGF6ZXVCOUVSWFhIWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoickROTzM1R2ovKzBXa0NtVktyMk1mOVp4d3FPaFZQRUhiK0J3V1p3T05BWT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJPTS9RU3p3dGNvQi92Slp0UVVEOW81ZWN0LzZJVDJ0SlVpWGd3VXRmckVnPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ2dDAwQXhuN2ZiMVpucGJReHBKOWlUQ0NDMTZyZks2SktQL0NmVytFWVFnPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IklLdWdMVXBBTU8yNUtGY2VSMWRLZ1lqVVRrWUNuTGE3dGxWTWRGTGZobTQ9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik9nN2h4YWVVbDROUEtsVktNKytsUFZ1MUs4R3pYYU9oa1ZKNlA0Q2Y2V0E9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib0MxSHlDazdaY2Nod1piQnlxTFBld3pWK1QwY01MN041TDl3ZGlhR1BFcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibW1MYjJRdkkzMXBqbUVpYXl6cHJ4aUh6bkp1ZTdTUXl2TmpVMk1zL2hTND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik5NbHRRRy80SjlNY2pwcjRuNTZQbkVQaHhsVElFSlNERHlDY2tTa2ErTDB4aG9MVWRsQ0NwdDBRNERqZXE5TTBoZzhtVmdFcEVyMFJPVDBSRFY2MERRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTg5LCJhZHZTZWNyZXRLZXkiOiJGd0ZyMnBXWGs3UWhyL0h6VVRuQzNlK0EzTlo4VDlXL1Fmb1d6N2NLek1BPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiIzeGJCdmNoVlE1dWtnaVJDZHJKaTlBIiwicGhvbmVJZCI6IjMxMTNiMDZiLWE0YjItNGIwYi04MjYzLWMyMTRlNmYxMjZkNiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJiS0hOZllxb3dYZzByTXB4c0tDZHdmTFptZ3M9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUkErR3ZwWE16QlY4cnUzMUxSNXgvOFpUdHhvPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6Iks0WURIRzhCIiwibWUiOnsiaWQiOiIyMjU3MTY5MTEyODoxM0BzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiJUaWR5In0sImFjY291bnQiOnsiZGV0YWlscyI6IkNNZVcwTmNERVBmRGtiWUdHQUVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJaQ3Rxck16T2RTK3ViN1drTzVlbWp4NFFiSFNEUVpPT0ZlTTN2MWgwRkdZPSIsImFjY291bnRTaWduYXR1cmUiOiJBOHBTajhBaHZPMjRFS01FWEFDdDFmREhvaUQwbzlOdk9kUW1SUm02KzVoTzBFQ2tJTi8zMnBlQ2FIdDRiMStwSVhkYWx5OTVEMmQ4ZllDMTR4aUdCZz09IiwiZGV2aWNlU2lnbmF0dXJlIjoiVDJ6cHZ3SGp1Yk9lVnhLMkZ2RUFmTm5wa1FUZDBBTzBvNkhZeXFQczVHRy9KN2ZsbTlxTFVDVml1RzJJM1hERnhORjdXa3hDcVpNZkxkRzUvZWQvQ0E9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyMjU3MTY5MTEyODoxM0BzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJXUXJhcXpNem5VdnJtKzFwRHVYcG84ZUVHeDBnMEdUamhYak43OVlkQlJtIn19XSwicGxhdGZvcm0iOiJzbWJhIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzI0MTQ2MTgwfQ==' 
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
