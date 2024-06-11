
let handler = async(m, { conn, usedPrefix, command }) => {
	
    let img = await conn.getFile(global.API('fgmods', '/api/img/asupan-la', { }, 'apikey'))
    let asupan = img.data
    conn.sendFile(m.chat, asupan, 'vid.mp4', `✅ Resultado`, m)
    m.react(dmoji)
    
}
handler.help = ['tvid']
handler.tags = ['img']
handler.command = ['asupan', 'tvid', 'videos', 'vid', 'video']
handler.premium = false
handler.diamond = true

export default handler
