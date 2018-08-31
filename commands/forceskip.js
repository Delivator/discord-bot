const musicPlayer = require("../util/musicPlayer");

exports.run = (client, message) => {
  let server = musicPlayer.servers[message.guild.id];
  if (server.dispatcher && musicPlayer.servers[message.guild.id].queue[0]) {
    if (server.replay) server.replay = false;
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
