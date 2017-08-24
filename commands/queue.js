const musicPlayer = require("../util/musicPlayer");

exports.run = (client, message, args) => {
  if (!musicPlayer.servers[message.guild.id] || !musicPlayer.servers[message.guild.id].queue[0]) return message.channel.send(`[Music] No songs in the queue.`);
  switch (args[0]) {
    case "clear":
      musicPlayer.servers[message.guild.id].queue.splice(1);
      message.channel.send(`[Music] Queue cleared.`);
      break;
  
    default:
      let queue = musicPlayer.servers[message.guild.id].queue;
      let queueList = "";
      if (musicPlayer.servers[message.guild.id].queue[0]) {
        for (var i = 0; i < queue.length; i++) {
          if (i === 0) {
            queueList += `**${i + 1}.** [Now Playing] \`${queue[i].title}\`\n`;
          } else {
            queueList += `**${i + 1}.** \`${queue[i].title}\`\n`;
          }
        }
      }
      message.channel.send(`[Music] Queue: \n${queueList}`, {split: {char: "\n"}});
      break;
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
  usage: "queue [clear]"
};
