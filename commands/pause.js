exports.run = (client, message) => {
  if (!message.member.voiceChannel) return message.channel.send("You have to be in a voice channel to use this command.");
  if (!message.guild.voiceConnection) return message.channel.send("[Music] Music bot not connected. Nothing to pause.");
  let connection = message.guild.voiceConnection;
  if (connection.dispatcher && !connection.dispatcher.paused) {
    connection.dispatcher.pause();
    message.channel.send("[Music] Music paused.");
  } else {
    message.channel.send("[Music] No music is playing. Nothing to pause.");
  }
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
