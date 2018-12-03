const settings = require("../config/settings.json");
const log = require("../util/logFunction");
const YouTube = require("youtube-node");
const musicDownloader = require("./musicDownloader");

const maxAutoplayHistory = 15;

const youTube = new YouTube();
youTube.setKey(settings.youtubeApiKey);

var servers = {};

function getYoutubeID(url) {
  let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  let match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return false;
  }
}

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

function addRecommended(message) {
  const server = servers[message.guild.id];
  if (!server.autoplay) return;
  if (!server.autoplayHistory) server.autoplayHistory = [];
  for (let i = 0; i < server.queue.length; i++) {
    if (!server.autoplayHistory.includes(server.queue[i].url)) server.autoplayHistory.push(getYoutubeID(server.queue[i].url));
  }
  const currentSong = server.queue[0];
  const youtubeId = getYoutubeID(currentSong.url);
  if (youtubeId) {
    youTube.related(youtubeId, 15, (error, result) => {
      if (error) return log.error(error);
      if (!result.items[0]) return;
      const video = result.items.find(video => {
        return !server.autoplayHistory.includes(video.id.videoId);
      });
      if (!video) return;
      const url = `https://www.youtube.com/watch?v=${video.id.videoId}`;
      musicDownloader.downloadSong(url, true)
        .then((file) => {
          server.autoplayHistory.push(video.id.videoId);
          if (server.autoplayHistory.length > maxAutoplayHistory) server.autoplayHistory.shift();
          server.queue.push({
            url: url,
            title: video.snippet.title,
            file: file,
            channel: message.channel,
            requester: message.client.user.id
          });
          if (!message.guild.voiceConnection) message.member.voiceChannel.join()
            .then(connection => {
              play(connection, message);
            });
        })
        .catch(log.error);
    });
  } else {
    youTube.search(currentSong.title, 15, { type: "video" }, (error, result) => {
      if (error) return log.error(error);
      if (!result.items[0]) return;
      const video = result.items.find(video => {
        return !server.autoplayHistory.includes(video.id.videoId);
      });
      if (!video) return;
      const url = `https://www.youtube.com/watch?v=${video.id.videoId}`;
      musicDownloader.downloadSong(url, true)
        .then((file) => {
          server.autoplayHistory.push(video.id.videoId);
          if (server.autoplayHistory.length > maxAutoplayHistory) server.autoplayHistory.shift();
          server.queue.push({
            url: url,
            title: video.snippet.title,
            file: file,
            channel: message.channel,
            requester: message.client.user.id
          });
          if (!message.guild.voiceConnection) message.member.voiceChannel.join()
            .then(connection => {
              play(connection, message);
            });
        })
        .catch(log.error);
    });
  }
}

function play(connection, message) {
  let server = servers[message.guild.id];
  if (server.queue[0].seekTime) {
    server.dispatcher = connection.playFile(`./.cache/${server.queue[0].file}`, { seek: server.queue[0].seekTime });
  } else {
    server.dispatcher = connection.playFile(`./.cache/${server.queue[0].file}`);
    if (server.repeat) {
      updateTopic(message.guild, `🔁 Currently playing: "${server.queue[0].title}" requested by <@${server.queue[0].requester}>`);
    } else {
      server.queue[0].channel.send(`[Music] Now playing: \`${server.queue[0].title}\` \`(${server.queue[0].url})\``);
      updateTopic(message.guild, `▶ Currently playing: "${server.queue[0].title}" requested by <@${server.queue[0].requester}>`);
      if (server.queue.length === 1) addRecommended(message);
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
        updateTopic(message.guild, `⏹ No music playing. Play music with ${settings.prefix}play <link / search text for youtube>.`);
        connection.disconnect();
      }
    }
  });
}

function pause(connection) {
  const server = servers[connection.channel.guild.id];

  if (connection.dispatcher && !connection.dispatcher.paused) {
    connection.dispatcher.pause();
    updateTopic(connection.channel.guild, `⏸ Paused "${server.queue[0].title}" [${convertTime(connection.dispatcher.time)}] requested by <@${server.queue[0].requester}>`);
  }
}

function resume(connection) {
  const server = servers[connection.channel.guild.id];

  if (connection.dispatcher && connection.dispatcher.paused) {
    connection.dispatcher.resume();
    updateTopic(connection.channel.guild, `▶ Currently playing: "${server.queue[0].title}" requested by <@${server.queue[0].requester}>`);
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
exports.addRecommended = addRecommended;
