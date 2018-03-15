const log = require("../util/logFunction").log;

module.exports = client => {
  log(`Bot ready! Logged in as "${client.user.tag}" (${client.user.id})`);
};
