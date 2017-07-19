const main = require("../index.js");

exports.run = function(client, message, args) {
  main.reload(message, args[0]);
};
