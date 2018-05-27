const musicPlayer = require("../util/musicPlayer");

exports.run = (client, message, args) => {
  if (!message.member.voiceChannel) return message.channel.send("You have to be in a voice channel to use this command.");
  if (!message.guild.voiceConnection) return message.channel.send(`[Music] Music bot not connected. Nothing to seek.`);
  if (!args[0] || isNaN(args[0])) {
    return message.channel.send(`You need to specify how many seconds you want to seek.`);
  } else {
    var seconds = parseFloat(args[0]);
  }
  let connection = message.guild.voiceConnection;
  if (connection.dispatcher) {
    let server = musicPlayer.servers[message.guild.id];
    musicPlayer.seek(connection, message, seconds);
    message.channel.send(`[Music] Music seeked ${(seconds > 0) ? "+" : ""}${seconds} seconds.`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "seek",
  description: "Seeks the music bot to a given second.",
  usage: "seek <seconds>"
};