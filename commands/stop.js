const musicPlayer = require("../util/musicPlayer");

exports.run = (client, message, args) => {
  let server = musicPlayer.servers[message.guild.id];

  if (message.guild.voiceConnection) {
    server.queue = [];
    server.dispatcher.end();
    message.channel.send(`[Music] Stopping the music bot.`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "stop",
  description: "Stops the music bot.",
  usage: "stop"
};
