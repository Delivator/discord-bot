const settings = require("../config/settings.json");
const log = require("../util/logFunction");

var servers = {};

function convertTime(time) {
  let seconds = time / 1000;
  let minutes = parseInt(seconds / 60);
  seconds = parseInt(seconds % 60);
  if (seconds.toString().length === 1) seconds = "0" + seconds;
  return `${minutes}:${seconds}`;
}

function updateTopic(guild, topic) {
  const musicChannel = guild.channels.find(channel => channel.name === "music" && channel.type === "text");
  if (!musicChannel || !musicChannel.manageable) return;
  musicChannel.edit({ "topic": topic }, "[music] status update")
    .catch(log.error);
}

function play(connection, message) {
  let server = servers[message.guild.id];
  if (server.queue[0].seekTime) {
    server.dispatcher = connection.playFile(`./.cache/${server.queue[0].file}`, { seek: server.queue[0].seekTime });
  } else {
    server.dispatcher = connection.playFile(`./.cache/${server.queue[0].file}`);
    if (!server.repeat) {
      server.queue[0].channel.send(`[Music] Now playing: \`${server.queue[0].title}\``);
      updateTopic(message.guild, `:arrow_forward: Currently playing: "${server.queue[0].title}" requested by <@${server.queue[0].requester}>`);
    }
  }

  server.dispatcher.on("end", () => {
    if (server.repeat) {
      connection.channel.join()
        .then(newCon => {
          play(newCon, message);
        })
        .catch(log.error);
    } else {
      server.queue.shift();
      if (server.queue[0]) {
        connection.channel.join()
          .then(newCon => {
            play(newCon, message);
          })
          .catch(log.error);
      } else {
        message.channel.send("[Music] No songs in the queue. Disconnecting.");
        updateTopic(message.guild, `:stop_button: No music playing. Play music with ${settings.prefix}play <link / search text for youtube>.`);
        connection.disconnect();
      }
    }
  });
}

function pause(connection) {
  const server = servers[connection.channel.guild.id];
  
  if (connection.dispatcher && !connection.dispatcher.paused) {
    connection.dispatcher.pause();
    updateTopic(connection.channel.guild, `:pause_button: Paused "${server.queue[0].title}" [${convertTime(connection.dispatcher.time)}] requested by <@${server.queue[0].requester}>`);
  }
}

function resume(connection) {
  const server = servers[connection.channel.guild.id];

  if (connection.dispatcher && connection.dispatcher.paused) {
    connection.dispatcher.resume();
    updateTopic(connection.channel.guild, `:arrow_forward: Currently playing: "${server.queue[0].title}" requested by <@${server.queue[0].requester}>`);
  }
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
exports.pause = pause;
exports.resume = resume;
