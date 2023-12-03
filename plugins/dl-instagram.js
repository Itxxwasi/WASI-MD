import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, args, command, text }) => {
  if (!text && !(m.quoted && m.quoted.text)) {
  if (!text) throw `You need to give the URL of Any Instagram video, post, reel, image`;
  m.reply(wait);

     }
  if (!text && m.quoted && m.quoted.text) {
    text = m.quoted.text;
  }

  let res;
  try {
  m.react("♻️")
    res = await fetch(`${gurubot}/igdlv1?url=${text}`);
  } catch (error) {
    throw `An error occurred: ${error.message}`;
  }

  let api_response = await res.json();

  if (!api_response || !api_response.data) {
    throw `No video or image found or Invalid response from API.`;
  }

  const mediaArray = api_response.data;

  for (const mediaData of mediaArray) {
    const mediaType = mediaData.type;
    const mediaURL = mediaData.url_download;

    let cap = `Hᴇʀᴇ ɪs ʏᴏᴜʀ ɪɴsᴛᴀ ${mediaType.toUpperCase()} ✅`;

    if (mediaType === 'video') {
      
      conn.sendFile(m.chat, mediaURL, 'instagram.mp4', cap, m);
    } else if (mediaType === 'image') {
      
      conn.sendFile(m.chat, mediaURL, 'instagram.jpg', cap, m);
      m.react("✅")
    }
  }
};

handler.help = ['instagram'];
handler.tags = ['downloader'];
handler.command = /^(instagram|igdl|ig|insta)$/i;

export default handler;
