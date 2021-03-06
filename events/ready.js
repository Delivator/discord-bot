const settings = require("../config/settings.json");
const log = require("../util/logFunction");

module.exports = (client) => {
  let time = new Date().getTime();
  log.good(`Bot ready! Logged in as "${client.user.tag}" (${client.user.id})`);
  log.good(`Command prefix is "${settings.prefix}"`);
  log.good(`Startup took ${(time - client.startTime)}ms`);
};
