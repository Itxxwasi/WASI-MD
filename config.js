const path = require("path");

module.exports = {
  // Basic Bot Info
  BOT_NAME: process.env.BOT_NAME || "wasi-md-v3",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "923192173398",

  // Multiple prefixes supported
  PREFIX: process.env.PREFIX ? process.env.PREFIX.split(",") : ["/", ".", "-"],

  // Session
  SESSION_DIR: process.env.SESSION_DIR || path.join(__dirname, "sessions"),
  MODE: process.env.MODE || "public",
  SESSION_ID: process.env.SESSION_ID || "", // Base64 session ID (if not using QR)

  // Server Settings
  SERVER_PORT: process.env.SERVER_PORT || 3000,
  SERVER_HOST: process.env.SERVER_HOST || "0.0.0.0",

  // Anti-call
  ANTI_CALL: process.env.ANTI_CALL === "false" ? false : true,
  REJECT_MSG:
    process.env.REJECT_MSG || "📵 Calls are blocked. Please send a message.",

  // Auto-Read and Auto-Status
  AUTO_READ: process.env.AUTO_READ === "true" ? true : false,
  AUTO_STATUS_VIEW: process.env.AUTO_STATUS_VIEW === "true" ? true : false,

  // Auto-Save and Forward Status
  AUTO_STATUS_SAVE: process.env.AUTO_STATUS_SAVE === "true" ? true : true,
  STATUS_FORWARD_JIDS: [
    "263788049675@s.whatsapp.net",
    "923192173398@s.whatsapp.net"
  ],

  // Optional Features
  AUTO_REACT: process.env.AUTO_REACT === "true" ? true : false,
  CUSTOM_REACT_EMOJIS:
    process.env.CUSTOM_REACT_EMOJIS || "🥲,😂,😐,🙂,😔",
};
