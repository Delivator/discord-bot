const musicPlayer = require("../util/musicPlayer");

exports.run = (client, message, args) => {
  let server = musicPlayer.servers[message.guild.id];
  if (server.dispatcher && musicPlayer.servers[message.guild.id].queue[0]) {
    let queue = musicPlayer.servers[message.guild.id].queue;
    if (queue[0].requester !== message.author.id) return message.channel.send(`[Music] Only the requester can skip songs.`);
    server.dispatcher.end();
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["s"],
  permLevel: 0
};

exports.help = {
  name: "skip",
  description: "Skips the current playing song.",
  usage: "skip"
};
