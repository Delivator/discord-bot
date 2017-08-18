const log = require("../util/logFunction").log;

module.exports = client => {
  log(`Bot ready! Logged in as "${client.user.tag}" with id "${client.user.id}"`);
  // for (const guild of client.guilds.values()) {
  //   // console.log(guild.id);
  // }
};
