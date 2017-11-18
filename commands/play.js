const settings = require("../config/settings.json");
const musicPlayer = require("../util/musicPlayer");
const musicDownloader = require("../util/musicDownloader");
const ytSearch = require("youtube-search");
const ytInfo = require("youtube-info");

function getYoutubeID(url) {
  let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  let match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return;
  }
}

function getVote(name) {
  switch (name) {
    case "1⃣":
      return 1;
      break;
    case "2⃣":
      return 2;
      break;
    case "3⃣":
      return 3;
      break;
    default:
      return;
  }
}

const ytOptions = {
  maxResults: 3,
  part: "snippet",
  type: "video",
  key: settings.youtubeApiKey
};

function addSongToQueue(url, title, message, msg) {
  let server = musicPlayer.servers[message.guild.id];
  musicDownloader.downloadSong(url, true, function(callback) {
    if (callback === false) return msg.edit(`[Music] Error while downloading file.`);
    server.queue.push({
      url: url,
      title: title,
      file: callback,
      channel: message.channel,
      requester: message.author.id
    });
    msg.edit(`[Music] \`${title}\` \`(${url})\` has been added to the queue.`);
    if (!message.guild.voiceConnection) message.member.voiceChannel.join()
      .then(connection => { musicPlayer.play(connection, message); });
  });
}

exports.run = (client, message, args) => {
  if (!args[0]) return message.channel.send(`[Music] Please provide a direct link or search for a video on youtube.`);

  if (!message.member.voiceChannel) return message.channel.send("[Music] You have to be in a voice channel to use this command.");

  let videoID = getYoutubeID(args[0]);
  let url, title;
  if (!musicPlayer.servers[message.guild.id]) musicPlayer.servers[message.guild.id] = {
    queue: []
  };
  let server = musicPlayer.servers[message.guild.id];
  if (videoID) {
    ytInfo(videoID).then(videoInfo => {
      let url = `https://www.youtube.com/watch?v=${videoInfo.videoId}`;
      let title = videoInfo.title;
      message.channel.send(`[Music] Downloading \`${url}\`...`).then(msg => {
        addSongToQueue(url, title, message, msg);
      });
    });
  } else if (args[0].startsWith("http://") || args[0].startsWith("https://")) {
    let url = args[0];
    message.channel.send(`[Music] Downloading \`${url}\`...`).then(msg => {
      musicDownloader.downloadSong(url, false, function(callback) {
        if (callback === false) return msg.edit(`[Music] Error while downloading file.`);
        server.queue.push({
          url: url,
          title: url,
          file: callback,
          channel: message.channel,
          requester: message.author.id
        });
        msg.edit(`[Music] \`${url}\` has been added to the queue.`);
        if (!message.guild.voiceConnection) message.member.voiceChannel.join()
          .then(connection => { musicPlayer.play(connection, message); });
      });
    });
  } else {
    ytSearch(args.join(" "), ytOptions, function(err, results) {
      if (err) return console.log(err);
      if (results.length === 1) {
        let url = `https://www.youtube.com/watch?v=${results[0].id}`;
        message.channel.send(`[Music] Downloading \`${url}\`...`).then(msg => {
          addSongToQueue(url, results[0].title, message, msg);
        });
        return;
      } else if(results.length === 0) {
        return message.channel.send(`[Music] No videos found.`);
      }
      let msgText = "[Music] Select from one of the following results by clicking on a reaction:\n";
      for (var i = 0; i < results.length; i++) {
        msgText += `**${i + 1}.** ${results[i].title} \`https://www.youtube.com/watch?v=${results[i].id}\`\n`;
      }
      message.channel.send(msgText)
        .then(async (msg) => {
          let selected = [];
          const collector = msg.createReactionCollector(
            (reaction, user) => user.id === message.author.id,
            {time: 30000}
          );
          collector.on("collect", r => {
            if (r.emoji.name === "❌") {
              msg.clearReactions();
              msg.edit(`[Music] Search canceld.`);
            }
            if (r.emoji.name === "✅") {
              if (selected.length < 1) {
                msg.clearReactions();
                return msg.edit(`[Music] No songs selected.`);
              }
              collector.stop();
              msg.clearReactions();
              for (var i = 0; i < selected.length; i++) {
                let video = results[selected[i] - 1];
                let url = `https://www.youtube.com/watch?v=${video.id}`;
                // addSongToQueue(url, video.title, message, msg);
                musicDownloader.downloadSong(url, true, function(callback) {
                  if (callback === false) return msg.edit(`[Music] Error while downloading file.`);
                  server.queue.push({
                    url: url,
                    title: video.title,
                    file: callback,
                    channel: message.channel,
                    requester: message.author.id
                  });
                  msg.edit(`[Music] ${selected.length} song(s) have been added to the queue.`);
                  if (!message.guild.voiceConnection) message.member.voiceChannel.join()
                    .then(connection => { musicPlayer.play(connection, message); });
                });
                
              }

            }
            let vote = getVote(r.emoji.name);
            if (vote) {
              if (!selected.includes(vote)) {
                selected.push(vote);
                oldMsg = msg.content.split("\n");
                oldMsg[vote] = `__**${selected.indexOf(vote) + 1}**__ - ` + oldMsg[vote];
                msg.edit(oldMsg.concat("\n"))
              };
            }
          });
          collector.on("end", r => {
            msg.clearReactions();
          });
          switch (results.length) {
            case 3:
              for (emoji of ["1⃣", "2⃣", "3⃣", "✅", "❌"]) {
                if (collector.ended) break;
                await msg.react(emoji);
              }
              break;
            case 2:
              for (emoji of ["1⃣", "2⃣", "✅", "❌"]) {
                if (collector.ended) break;
                await msg.react(emoji);
              }
              break;
            default:
          }
        });
    });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "play",
  description: "Plays a song from a youtube link",
  usage: "play <link / youtube search>"
};
