const log = require("../util/logFunction");

module.exports = (guild) => {
  log(`Bot joined the guild "${guild.name}" (${guild.id})`);
};
