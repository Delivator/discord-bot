const musicPlayer = require("../util/musicPlayer");

exports.run = (client, message) => {
  if (!message.member.voiceChannel) return message.channel.send("You have to be in a voice channel to use this command.");
  if (!message.guild.voiceConnection) return message.channel.send("[Music] Music bot not connected.");
  let server = musicPlayer.servers[message.guild.id];
  if (!server.repeat) {
    server.repeat = true;
  } else {
    server.repeat = !server.repeat;
  }
  message.channel.send(`[Music] Repeat has been set to ${server.repeat ? "on" : "off"}`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "repeat",
  description: "Toggles the repeat mode of the music playback.",
  usage: "repeat [on/off]"
};
