var servers = {};

function play(connection, message) {
  let server = servers[message.guild.id];
  if (server.queue[0].seekTime) {
    server.dispatcher = connection.playFile(`./.cache/${server.queue[0].file}`, { seek: server.queue[0].seekTime });
  } else {
    server.dispatcher = connection.playFile(`./.cache/${server.queue[0].file}`);
    server.queue[0].channel.send(`[Music] Now playing: \`${server.queue[0].title}\``);
  }

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

function seek(connection, message, seconds) {
  let server = servers[message.guild.id];
  let oldSeekTime = 0;
  if (server.queue[0].seekTime) oldSeekTime = server.queue[0].seekTime;
  let seekTime = seconds + oldSeekTime + (connection.dispatcher.time / 1000);
  let queueObject = server.queue[0];
  queueObject.seekTime = seekTime;
  server.queue.unshift(queueObject);
  if (server.dispatcher) server.dispatcher.end();
}

exports.servers = servers;
exports.play = play;
exports.seek = seek;
