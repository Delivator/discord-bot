const musicPlayer = require("../util/musicPlayer");
const settings = require("../config/settings.json");

exports.run = (client, message, args) => {
  let server = musicPlayer.servers[message.guild.id];
  if (!message.member.voiceChannel) return message.channel.send("[Music] You have to be in a voice channel to use this command.");
  if (server && server.dispatcher && musicPlayer.servers[message.guild.id].queue[0]) {
    let queue = musicPlayer.servers[message.guild.id].queue;
    if (queue[0].requester === message.author.id) {
      server.dispatcher.end();
    } else {
      let voiceChannelMembers = message.member.voiceChannel.members.size - 1;
      let skipsNeeded = voiceChannelMembers * settings.skipratio;
      if (skipsNeeded % 2 > 0) skipsNeeded = parseInt(skipsNeeded + 1);
      if (server.queue[0].skips) {
        let skips = server.queue[0].skips;
        for (let i = 0; i < server.queue[0].skips.length; i++) {
          if (!message.member.voiceChannel.members.get(skips[i])) skips.splice(i, 1);
        }
      } else {
        server.queue[0].skips = [];
      }
      if (!server.queue[0].skips.includes(message.author.id)) {
        let skips = server.queue[0].skips;
        skips.push(message.author.id);
        if (skips.length >= skipsNeeded) {
          server.dispatcher.end();
          message.channel.send(`[Music] ${skips.length}/${skipsNeeded}. Skipping the song.`)
        }
        message.channel.send(`[Music] ${skips.length}/${skipsNeeded} to skip the song.`).then(msg => { msg.delete(10000) });
      };
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["s"],
  permLevel: 0
};

exports.help = {
  name: "skip",
  description: "Skips the current playing song.",
  usage: "skip"
};
