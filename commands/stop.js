const log = require("../util/logFunction").log;
const musicPlayer = require("../util/musicPlayer");

exports.run = (client, message, args) => {
  let server = musicPlayer.servers[message.guild.id];

  if (message.guild.voiceConnection) {
    for (var i = server.queue.length -1; i >= 0; i++) {
      server.queue.splice(i, 1);
    }
    server.dispatcher.end();
    log("Queue cleard. Stopping the music bot.");
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "stop",
  description: "Stops the music bot.",
  usage: "stop"
};
