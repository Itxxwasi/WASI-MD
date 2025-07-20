// index.js
const fs = require("fs");
const path = require("path");
const { startWasiConnection } = require("./mainwasi/connection");
const { startWasiServer } = require("./server");

// Load plugins before connecting (register commands)
const pluginPath = path.join(__dirname, "plugins");
if (fs.existsSync(pluginPath)) {
  console.log("🔄 Loading plugins...");
  fs.readdirSync(pluginPath).forEach(file => {
    if (file.endsWith(".js")) {
      require(path.join(pluginPath, file));
      console.log(`✅ Loaded plugin: ${file}`);
    }
  });
} else {
  console.log("⚠ No plugins folder found. Skipping plugin load.");
}

console.log("🚀 Starting WASI-MD-V3...");
startWasiConnection(); // async, returns sock but we don't need to await
startWasiServer();















// const { startWasiConnection } = require("./mainwasi/connection");
// const fs = require("fs");
// const path = require("path");

// console.log("🚀 Starting WASI-MD-V3...");

// // Auto-load all commands/plugins before starting the bot
// const pluginPath = path.join(__dirname, "plugins");
// if (fs.existsSync(pluginPath)) {
//   console.log("🔄 Loading plugins...");
//   fs.readdirSync(pluginPath).forEach((file) => {
//     if (file.endsWith(".js")) {
//       require(path.join(pluginPath, file));
//       console.log(`✅ Loaded plugin: ${file}`);
//     }
//   });
// } else {
//   console.log("⚠ No plugins folder found. Skipping plugin load.");
// }

// // Start the bot
// startWasiConnection();

// //========================================================================================
// // const { startWasiConnection } = require("./mainwasi/connection");

// // console.log("🚀 Starting WASI-MD-V3...");
// // startWasiConnection();
