const ytdl = require("ytdl-core");

var servers = {};

function play(connection, message) {
  let server = servers[message.guild.id];
  server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
  server.queue.shift();
  server.dispatcher.on("end", () => {
    if (server.queue[0]) {
      play(connection, message);
    } else {
      connection.disconnect();
    }
  });
}

exports.servers = servers;

exports.play = play;
