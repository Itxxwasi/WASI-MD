import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import path from 'path';
import { writeFileSync } from 'fs';

async function processTxtAndSaveCredentials(txt) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  let decodedData;

  
  const isBase64 = /^[a-zA-Z0-9+/]+={0,2}$/.test(txt);

  if (isBase64) {
    
    decodedData = Buffer.from(txt, 'base64').toString('utf-8');
  } else {
   
    const url = `https://gurupaste.gurucharan-saho.repl.co/pastes?action=getpaste&id=${txt}`;

    try {
      const response = await fetch(url);

      const base64Data = await response.json();

      const realbase64Data = base64Data.content;

      decodedData = Buffer.from(realbase64Data, 'base64').toString('utf-8');
    } catch (error) {
      console.error('Error retrieving or processing data:', error);
      return;
    }
  }

  
  const credentials = JSON.parse(decodedData);

  const credsPath = path.join(__dirname, '..', 'sessions', 'creds.json');
  writeFileSync(credsPath, JSON.stringify(credentials, null, 2));

  console.log('Credentials saved to creds.json');
}

export default processTxtAndSaveCredentials
