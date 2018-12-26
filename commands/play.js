const settings = require("../config/settings.json");
const musicPlayer = require("../util/musicPlayer");
const musicDownloader = require("../util/musicDownloader");
const YouTube = require("youtube-node");
const log = require("../util/logFunction");

const youTube = new YouTube();
youTube.setKey(settings.youtubeApiKey);

// Credit to: https://gist.github.com/steve-taylor/5075717
function doSynchronousLoop(data, processData, done) {
  if (data.length > 0) {
    var loop = function (data, i, processData, done) {
      processData(data[i], i, function () {
        if (++i < data.length) {
          loop(data, i, processData, done);
        } else {
          done();
        }
      });
    };
    loop(data, 0, processData, done);
  } else {
    done();
  }
}

function getYoutubeID(url) {
  let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  let match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return false;
  }
}

function getPlaylistID(url) {
  let regExp = /^https?:\/\/.*(list=)([^#&?/]*).*/;
  let match = url.match(regExp);
  if (match) {
    return match[2];
  } else {
    return false;
  }
}

function getVote(name) {
  switch (name) {
    case "1⃣":
      return 1;
    case "2⃣":
      return 2;
    case "3⃣":
      return 3;
    default:
      return;
  }
}

exports.run = (client, message, args) => {
  while (args[0] === "") {
    args.shift();
  }
  if (!args[0]) return message.channel.send("[Music] Please provide a direct link or search for a video on youtube.");
  if (!message.member.voiceChannel) return message.channel.send("[Music] You have to be in a voice channel to use this command.");

  let videoID = getYoutubeID(args[0]),
    playlistID = getPlaylistID(args[0]);
  if (!musicPlayer.servers[message.guild.id]) musicPlayer.servers[message.guild.id] = { queue: [] };
  let server = musicPlayer.servers[message.guild.id];

  function handlePlaylist() {
    youTube.getPlayListsById(playlistID, function (error, result) {
      if (error) return log.error(error);
      if (!result) return log.error("[youtube-node] Couldn't get any results from youtube");
      if (result.pageInfo.totalResults <= 0) {
        if (videoID) {
          handleYoutube();
        } else {
          handleSearch();
        }
        return log.error("[youtube-node] Couldn't get any results from youtube. Maybe the playlist is private?");
      }
      let playlistName = result.items[0].snippet.title,
        playlistOwner = result.items[0].snippet.channelTitle;
      message.channel.send(`[Music] Found a playlist: \`${playlistName}\` by \`${playlistOwner}\`. Do you wanna add the full playlist?`).then((msg) => {
        msg.react("✅").then(() => msg.react("❌"));
        const collector = msg.createReactionCollector(
          (reaction, user) => user.id === message.author.id,
          { time: 30000 }
        );
        collector.on("end", () => {
          msg.clearReactions();
          return;
        });
        collector.on("collect", r => {
          if (r.emoji.name === "✅") {
            msg.clearReactions();
            youTube.getPlayListsItemsById(playlistID, settings.maxplaylistsize, function (error, result) {
              if (error) return log.error(error);
              doSynchronousLoop(result.items, (item, i, next) => {
                let url = "https://www.youtube.com/watch?v=" + item.contentDetails.videoId,
                  title = item.snippet.title;
                msg.edit(`[Music] Downloading song ${i + 1}/${result.items.length}...`);
                musicDownloader.downloadSong(url, true)
                  .then(file => {
                    server.queue.push({
                      url: url,
                      title: title,
                      file: file,
                      channel: message.channel,
                      requester: message.author.id
                    });
                    if (!message.guild.voiceConnection) message.member.voiceChannel.join()
                      .then(connection => { musicPlayer.play(connection, message); });
                    next();
                  });
              }, () => {
                msg.edit(`[Music] Done downloading ${result.items.length}/${result.items.length} songs.`);
              });
            });
          } else if (r.emoji.name === "❌") {
            msg.clearReactions();
            if (videoID) {
              handleYoutube();
            } else {
              handleSearch();
            }
          }
        });
      });
    });
  }

  function handleYoutube() {
    youTube.getById(videoID, function (error, result) {
      if (error) return log.error(error);
      let url = `https://www.youtube.com/watch?v=${result.items[0].id}`;
      let title = result.items[0].snippet.title;
      message.channel.send(`[Music] Downloading \`${url}\`...`).then(msg => {
        musicDownloader.downloadSong(url, true)
          .then((file) => {
            server.queue.push({
              url: url,
              title: title,
              file: file,
              channel: message.channel,
              requester: message.author.id
            });
            msg.edit(`[Music] \`${title}\` \`(${url})\` has been added to the queue.`);
            if (!message.guild.voiceConnection) message.member.voiceChannel.join()
              .then(connection => { musicPlayer.play(connection, message); });
          })
          .catch((err) => { return msg.edit(`[Music] Error while downloading file. (${err})`); });

      });
    });
  }
  function handleUrl() {
    let url = args[0];
    message.channel.send(`[Music] Downloading \`${url}\`...`).then(msg => {
      musicDownloader.downloadSong(url, false)
        .then((file) => {
          server.queue.push({
            url: url,
            title: url,
            file: file,
            channel: message.channel,
            requester: message.author.id
          });
          msg.edit(`[Music] \`${url}\` has been added to the queue.`);
          if (!message.guild.voiceConnection) message.member.voiceChannel.join()
            .then(connection => { musicPlayer.play(connection, message); });
        })
        .catch((err) => { return msg.edit(`[Music] Error while downloading file. (${err})`); });
    });
  }

  function handleSearch() {
    youTube.search(args.join(" "), 3, { type: "video" }, function (error, results) {
      if (error) return log.error(error);
      if (results.items.length === 1) {
        videoID = results.items[0].id.videoId;
        handleYoutube();
        return;
      } else if (results.items.length === 0) {
        return message.channel.send("[Music] No videos found.");
      }
      let msgText = "[Music] Select from one of the following results by clicking on a reaction:\n";
      for (var i = 0; i < results.items.length; i++) {
        msgText += `**${i + 1}.** ${results.items[i].snippet.title} \`https://www.youtube.com/watch?v=${results.items[i].id.videoId}\`\n`;
      }
      message.channel.send(msgText)
        .then(async (msg) => {
          const collector = msg.createReactionCollector(
            (reaction, user) => user.id === message.author.id,
            { time: 30000 }
          );
          collector.on("collect", r => {
            if (r.emoji.name === "❌") {
              msg.clearReactions();
              msg.edit("[Music] Search cancelled.");
            }
            let vote = getVote(r.emoji.name);
            if (vote) {
              collector.stop();
              let video = results.items[vote - 1];
              let url = `https://www.youtube.com/watch?v=${video.id.videoId}`;
              msg.clearReactions();
              msg.edit(`[Music] Downloading \`${url}\`...`);
              musicDownloader.downloadSong(url, true)
                .then((file) => {
                  server.queue.push({
                    url: url,
                    title: video.snippet.title,
                    file: file,
                    channel: message.channel,
                    requester: message.author.id
                  });
                  msg.edit(`[Music] \`${video.snippet.title}\` \`(${url})\` has been added to the queue.`);
                  if (!message.guild.voiceConnection) message.member.voiceChannel.join()
                    .then(connection => {
                      musicPlayer.play(connection, message);
                    });
                })
                .catch((err) => { return msg.edit(`[Music] Error while downloading file. (${err})`); });
            }
          });
          collector.on("end", () => {
            msg.clearReactions();
            msg.edit("[Music] Search cancelled.");
          });
          switch (results.items.length) {
            case 3:
              for (let emoji of ["1⃣", "2⃣", "3⃣", "❌"]) {
                if (collector.ended) break;
                await msg.react(emoji);
              }
              break;
            case 2:
              for (let emoji of ["1⃣", "2⃣", "❌"]) {
                if (collector.ended) break;
                await msg.react(emoji);
              }
              break;
            default:
          }
        });
    });
  }

  if (playlistID) {
    handlePlaylist();
  } else if (videoID) {
    handleYoutube();
  } else if (args[0].startsWith("http://") || args[0].startsWith("https://")) {
    handleUrl();
  } else {
    handleSearch();
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["p"],
  permLevel: 0
};

exports.help = {
  name: "play",
  description: "Plays a song (direct link or search)",
  usage: "play <link / search text for youtube>"
};
