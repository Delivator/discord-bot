const musicPlayer = require("../util/musicPlayer");

function convertTime(time) {
  let seconds = time / 1000;
  let minutes = parseInt(seconds / 60);
  seconds = parseInt(seconds % 60);
  if (seconds.toString().length === 1) seconds = "0" + seconds;
  return `${minutes}:${seconds}`;
}

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
      let connection = message.guild.voiceConnection;
      if (musicPlayer.servers[message.guild.id].queue[0]) {
        for (var i = 0; i < queue.length; i++) {
          if (i === 0) {
            queueList += `**${i + 1}.** __${queue[i].title}__ [${convertTime(connection.dispatcher.time)}]\n`;
          } else {
            queueList += `**${i + 1}.** ${queue[i].title}\n`;
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
