var servers = {};

function play(connection, message) {
  let server = servers[message.guild.id];
  server.dispatcher = connection.playFile(`./.cache/${server.queue[0].file}`);

  server.queue[0].channel.send(`[Music] Now playing: \`${server.queue[0].title}\``);

  server.dispatcher.on("end", () => {
    server.queue.shift();
    if (server.queue[0]) {
      play(connection, message);
    } else {
      message.channel.send(`[Music] No songs in the queue. Disconnecting.`);
      connection.disconnect();
    }
  });
}

exports.servers = servers;
exports.play = play;
