// lib/command.js

var commands = [];

/**
 * Register a new command
 * @param {Object} info - Command info
 * @param {Function} func - Command function
 */
function cmd(info, func) {
    var data = info;
    data.function = func;
    data.pattern = info.pattern?.toLowerCase() || '';
    data.alias = info.alias || [];
    data.desc = info.desc || '';
    data.category = info.category || 'misc';
    data.dontAddCommandList = info.dontAddCommandList || false;
    data.filename = info.filename || "Not Provided";

    commands.push(data);
    return data;
}

/**
 * Get list of all registered commands (except those with dontAddCommandList)
 */
function listCommands() {
    return commands.filter(c => !c.dontAddCommandList);
}

module.exports = {
    cmd,
    AddCommand: cmd,
    Function: cmd,
    Module: cmd,
    commands,
    listCommands
};









// /**
//  * Command registration system for WASI-MD-V3
//  *
//  * Usage Example:
//  * const { cmd } = require("../lib/command");
//  * cmd({ pattern: "ping", desc: "Check bot status" }, async (sock, m) => {
//  *    await sock.sendMessage(m.key.remoteJid, { text: "Pong! 🏓" }, { quoted: m });
//  * });
//  */

// var commands = [];

// /**
//  * Register a new command
//  * @param {Object} info - Command metadata (pattern, desc, category, alias, etc.)
//  * @param {Function} func - The function to execute when the command is triggered
//  * @returns {Object} - The registered command object
//  */
// function cmd(info, func) {
//     var data = info;
//     data.function = func;

//     if (!data.dontAddCommandList) data.dontAddCommandList = false;
//     if (!info.desc) info.desc = "";
//     if (!data.fromMe) data.fromMe = false;
//     if (!info.category) info.category = "misc";
//     if (!info.alias) info.alias = [];
//     if (!info.filename) info.filename = "Not Provided";

//     commands.push(data);
//     return data;
// }

// module.exports = {
//     cmd,
//     AddCommand: cmd,
//     Function: cmd,
//     Module: cmd,
//     commands,
// };
