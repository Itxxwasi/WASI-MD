import fetch from "node-fetch";
import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
dotenv.config(); 

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);


let handler = async (m, { conn, usedPrefix, command, text }) => {
  try {
    if (!text && !(m.quoted && m.quoted.text)) {
      m.reply('Please provide some text or quote a message to get a response.');
      m.react("🌀")
      return;
    }

    if (!text && m.quoted && m.quoted.text) {
      text = m.quoted.text;
    } else if (text && m.quoted && m.quoted.text) {
      text = `${text} ${m.quoted.text}`;
    }
    m.react(rwait)
    let gMsg = await conn.sendMessage(m.chat, { text: '𝙷𝚘𝚕𝚍 𝚘𝚗 𝚝𝚑𝚎 𝙿𝚛𝚒𝚗𝚌𝚎𝙱𝚘𝚝 ɢᴘᴛ 𝚒𝚜 𝚃𝚢𝚙𝚒𝚗𝚐...' }, {quoted: m});
     const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: text }],
    });

    if (response.data.choices && response.data.choices.length > 0) {
      const reply = response.data.choices[0].message.content;
      await conn.relayMessage(m.chat, {
        protocolMessage: {
          key: gMsg.key,
          type: 14,
          editedMessage: {
            conversation: reply
          }
        }
      }, {});
      
      m.react(done)
     
    } else {
      throw new Error("Empty response from OpenAI");
    }
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Error response:", error.response);
    conn.reply(m.chat, "An error occurred. Please try again later.", m);
m.react("❌")
  }
}
handler.command = /^(openai|ai)$/i;
handler.help = ["ai", "openai"].map(v => v + " <texts>");
handler.tags = ["internet"];
export default handler;
