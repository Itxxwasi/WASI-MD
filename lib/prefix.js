// lib/prefix.js
const config = require("../config");

/**
 * Detects the prefix used in a text and extracts command info.
 * @param {string} text - User message text
 * @returns {object|null} { usedPrefix, cmdName, args, fullText }
 */
function parseCommand(text) {
  if (!text || typeof text !== "string") return null;

  let prefixes = config.PREFIX;
  if (!Array.isArray(prefixes)) prefixes = [prefixes];

  const usedPrefix = prefixes.find((p) => text.startsWith(p));
  if (!usedPrefix) return null;

  const body = text.slice(usedPrefix.length).trim();
  if (!body) return null;

  const [cmdName, ...args] = body.split(/\s+/);
  return {
    usedPrefix,
    cmdName: cmdName.toLowerCase(),
    args,
    fullText: text.trim()
  };
}

module.exports = { parseCommand };
