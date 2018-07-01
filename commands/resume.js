exports.run = (client, message) => {
  if (!message.member.voiceChannel) return message.channel.send("You have to be in a voice channel to use this command.");
  if (!message.guild.voiceConnection) return message.channel.send("[Music] Music bot not connected. Nothing to resume.");
  let connection = message.guild.voiceConnection;
  if (connection.dispatcher && connection.dispatcher.paused) {
    connection.dispatcher.resume();
    message.channel.send("[Music] Music resumed.");
  } else {
    message.channel.send("[Music] Music bot is not paused. Nothing to resume.");
  }
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
