const musicPlayer = require("../util/musicPlayer");

exports.run = (client, message, args) => {
  if (!musicPlayer.servers[message.guild.id] || !musicPlayer.servers[message.guild.id].queue[0]) {
    message.channel.send(`[Music] No songs in the queue.`);
  } else {
    let queue = musicPlayer.servers[message.guild.id].queue;
    let queueList = "";
    if (musicPlayer.servers[message.guild.id].queue[0]) {
      for (var i = 0; i < queue.length; i++) {
        queueList += `**${i + 1}.** \`${queue[i]}\`\n`;
      }
    }
    // message.channel.send(`[Music] Queue: \`${musicPlayer.servers[message.guild.id].queue.join("`, `")}\``);
    message.channel.send(`[Music] Queue: \n${queueList}`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "queue",
  description: "Sends a list of song in the queue.",
  usage: "queue"
};
