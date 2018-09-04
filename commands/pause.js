const musicPlayer = require("../util/musicPlayer");

exports.run = (client, message) => {
  if (!message.guild.voiceConnection) return;
  musicPlayer.pause(message.guild.voiceConnection);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "pause",
  description: "Pauses the music bot.",
  usage: "pause"
};
