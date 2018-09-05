const musicPlayer = require("../util/musicPlayer");

exports.run = (client, message) => {
  if (!message.member.voiceChannel) return message.channel.send("You have to be in a voice channel to use this command.");
  if (!message.guild.voiceConnection) return message.channel.send("[Music] Music bot not connected.");
  let server = musicPlayer.servers[message.guild.id];
  if (!server.autoplay) {
    server.autoplay = true;
  } else {
    server.autoplay = !server.autoplay;
  }
  if (server.autoplay) {
    const server = musicPlayer.servers[message.guild.id];
    if (server.queue.length === 1) musicPlayer.addRecommended(message);
  }
  message.channel.send(`[Music] Autoplay has been set to ${server.autoplay ? "on" : "off"}`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "autoplay",
  description: "Toggles the autoplay mode of the music playback.",
  usage: "autoplay [on/off]"
};
