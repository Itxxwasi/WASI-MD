
let handler = async (m, { conn, text }) => {
    function no(number){
    return number.replace(/\s/g,'').replace(/([@+-])/g,'')
  }

    text = no(text)

  if(isNaN(text)) {
		var number = text.split`@`[1]
  } else if(!isNaN(text)) {
		var number = text
  }

    if(!text && !m.quoted) return m.reply(`*❏ RESETEAR A USUARIO*\n\nEtiquete al usuario, escriba el número o responda al mensaje del usuario que desea REINICIAR`)
    if(isNaN(number)) return m.reply(`❏ El número que ingresaste no es válido`)

      try { 
		if(text) {
			var user = number + '@s.whatsapp.net'
		} else if(m.quoted.sender) {
			var user = m.quoted.sender
		} else if(m.mentionedJid) {
  		  var user = number + '@s.whatsapp.net'
			}  
		} catch (e) {
  } finally {
    	let number = user.split('@')[0]
        delete global.global.db.data.users[user]
        conn.reply(m.chat, `*❏ USUARIO REINICIADO*\n\n✅ Se reinició a @${number} de la *BASE DE DATOS*`, null, { mentions: [user] })
    }
    
}
handler.help = ['reset']
handler.tags = ['owner']
handler.command = ['reset'] 
handler.rowner = true

export default handler
