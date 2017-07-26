const log = require("../util/logFunction").log;
const low = require('lowdb');

const db = low("./util/db.json");
db.defaults( {servers: {}, users: {}} ).write();

module.exports = client => {
  log(`Bot ready! Logged in as "${client.user.tag}" with id "${client.user.id}"`);
};
