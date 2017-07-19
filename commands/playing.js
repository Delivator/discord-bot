const settings = require("../config/settings.json");

exports.run = function(client, message, args) {
  let playingText = message.content.substring(settings.cmd_prefix.length + 8);
  client.user.setGame(playingText, "");
  console.log("Playing text set to: " + playingText);
};
