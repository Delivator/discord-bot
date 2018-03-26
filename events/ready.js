const log = require("../util/logFunction");

module.exports = client => {
  let time = new Date().getTime();
  log.good(`Bot ready! Logged in as "${client.user.tag}" (${client.user.id})`);
  log.good(`Startup took ${(time - client.startTime) / 1000}s`);
};
