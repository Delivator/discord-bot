const musicPlayer = require("../util/musicPlayer");

exports.run = (client, message, args) => {
  let server = musicPlayer.servers[message.guild.id];
  if (server.dispatcher && musicPlayer.servers[message.guild.id].queue[0]) {
    server.dispatcher.end();
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["fs"],
  permLevel: 2
};

exports.help = {
  name: "forceskip",
  description: "Skips the current playing song. Only for Mods.",
  usage: "forceskip"
};
