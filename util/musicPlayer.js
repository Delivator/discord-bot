var servers = {};

function play(connection, message) {
  let server = servers[message.guild.id];
  server.dispatcher = connection.playFile(`./.cache/${server.queue[0].file}`);

  message.channel.send(`[Music] Now playing: \`${server.queue[0].title}\``);

  server.dispatcher.on("end", () => {
    server.queue.shift();
    if (server.queue[0]) {
      play(connection, message);
    } else {
      message.channel.send(`[Music] No song in the queue. Disconnecting.`);
      connection.disconnect();
    }
  });
}

function pause(connection, message) {
  if (connection.dispatcher) {
    connection.dispatcher.pause();
    message.channel.send(`[Music] Music bot paused.`);
  } else {
    message.channel.send(`[Music] No music is playing. Nothing to pause.`);
  }
}

function resume(connection, message) {
  if (connection.dispatcher) {
    connection.dispatcher.resume();
    message.channel.send(`[Music] Music bot resumed.`);
  } else {
    message.channel.send(`[Music] No music is paused. Nothing to resume.`);
  }
}

exports.servers = servers;

exports.play = play;
exports.pause = pause;
exports.resume = resume;
