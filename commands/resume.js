const musicPlayer = require("../util/musicPlayer");

exports.run = (client, message, args) => {
  if (!message.member.voiceChannel) {
    message.channel.send("You have to be in a voice channel to use this command.");
  } else {
    if (!message.guild.voiceConnection) {
      message.channel.send(`[Music] Music bot not connected. Nothing to resume.`);
    } else {
      musicPlayer.resume(message.guild.voiceConnection, message);
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "resume",
  description: "Resumes the music bot.",
  usage: "resume"
};
