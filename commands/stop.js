const musicPlayer = require("../util/musicPlayer");

exports.run = (client, message) => {
  let server = musicPlayer.servers[message.guild.id];

  if (message.guild.voiceConnection) {
    if (server.repeat) server.repeat = false;
    if (server.autoplay) server.autoplay = false;
    server.queue = [];
    server.dispatcher.end();
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "stop",
  description: "Stops the music bot.",
  usage: "stop"
};
