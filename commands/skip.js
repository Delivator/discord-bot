const musicPlayer = require("../util/musicPlayer");

exports.run = (client, message, args) => {
  let server = musicPlayer.servers[message.guild.id];
  if (server.dispatcher) server.dispatcher.end();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "skip",
  description: "Skips the current playing song.",
  usage: "skip"
};
