import fs from 'fs';
import syntaxError from 'syntax-error';
import path from 'path';
import cp, { exec as _exec } from 'child_process';
import { promisify } from 'util';

const exec = promisify(_exec).bind(cp);
let handler = async (m, { conn, isROwner, usedPrefix, command, text }) => {
  const pluginNames = Object.keys(plugins).map(name => name.replace('.js', ''));
  
  if (!text) {
    throw `
✳️ Uso del comando : ${usedPrefix + command} <name file>
      
📌 Ejemplo:
${usedPrefix + command} main-menu
`.trim();
  }

  if (!pluginNames.includes(text)) {
    return m.reply(`
📌 *Ejemplo:* 
 ${usedPrefix + command} main-menu 
      
      ≡ *Lista de Plugins*
┌─⊷
 ${pluginNames.map(name => `▢ ${name}`).join('\n')}
└───────────
    `);
  }

  try {
    const { stdout, stderr } = await exec(`cat plugins/${text}.js`);
    const pluginFilePath = path.join('./plugins', `${text}.js`);
    
    if (stdout.trim()) { 
      const res = await conn.sendMessage(m.chat, { text: stdout }, { quoted: m });
      await conn.sendMessage(m.chat, { document: fs.readFileSync(pluginFilePath), mimetype: 'application/javascript', fileName: `${text}.js` }, { quoted: res });
    } 

    if (stderr.trim()) { 
      const arc = await conn.sendMessage(m.chat, { text: stderr }, { quoted: m });
      await conn.sendMessage(m.chat, { document: fs.readFileSync(pluginFilePath), mimetype: 'application/javascript', fileName: `${text}.js` }, { quoted: arc });
    }
  } catch (e) {
    m.reply('❎ Error')
  }
};
handler.help = ['getplugin']
handler.tags = ['owner']
handler.command = ['getplugin']
handler.rowner = true

export default handler
