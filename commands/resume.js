const musicPlayer = require("../util/musicPlayer");

exports.run = (client, message) => {
  if (!message.guild.voiceConnection) return;
  musicPlayer.resume(message.guild.voiceConnection);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["r"],
  permLevel: 0
};

exports.help = {
  name: "resume",
  description: "Resumes the music bot.",
  usage: "resume"
};
