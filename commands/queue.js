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
  let queue = musicPlayer.servers[message.guild.id].queue;
  switch (args[0]) {
    case "clear":
      queue.splice(1);
      message.channel.send(`[Music] Queue cleared.`);
      break;
    case "remove":
      if (isNaN(args[1])) return message.channel.send(`[Music] Please provide a valid number.`);
      let queueIndex = parseInt(args[1]);
      if (queueIndex > queue.length) return message.channel.send(`[Music] There are only ${queue.length} songs in the queue. Please enter a number from 1-${queue.length}`);
      if (queueIndex === 1) {
        let server = musicPlayer.servers[message.guild.id];
        if (server.dispatcher) server.dispatcher.end();
      } else {
        queueIndex--;
        message.channel.send(`[Music] Removed \`${queue[queueIndex].title}\` from the queue.`);
        queue.splice(queueIndex, 1);
      }
      break;
    default:
      let queueList = "";
      let connection = message.guild.voiceConnection;
      if (queue[0]) {
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
