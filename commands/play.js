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

exports.run = (client, message, args) => {
  if (!args[0]) {
    message.channel.send(`[Music] Please provide a link! Use \`${settings.prefix}help play\` for more information.`);
  } else {
    if (!message.member.voiceChannel) {
      message.channel.send("[Music] You have to be in a voice channel to use this command.");
    } else {
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
          musicDownloader.downloadSong(url, function(callback) {
            if (callback === false) return(message.channel.send(`Error while downloading file.`));
            server.queue.push({
              url: url,
              title: title,
              file: callback
            });
            message.channel.send(`[Music] \`${title}\` \`(${url})\` has been added to the queue.`);
            if (!message.guild.voiceConnection) message.member.voiceChannel.join()
              .then(connection => { musicPlayer.play(connection, message); });
          });
        });
      } else if (args[0].startsWith("http://") || args[0].startsWith("https://")) {
        server.queue.push({
          url: args[0],
          title: args[0]
        });
        message.channel.send(`[Music] \`${args[0]}\` has been added to the queue.`);
        if (!message.guild.voiceConnection) message.member.voiceChannel.join()
          .then(connection => {
            musicPlayer.play(connection, message);
          });
      } else {
        const options = {
          maxResults: 3,
          part: "snippet",
          type: "video",
          key: settings.youtubeApiKey
        };
        ytSearch(args.join(" "), options, function(err, results) {
          if (err) return console.log(err);
          if (results.length === 1) {
            let url = `https://www.youtube.com/watch?v=${results[0].id}`;
            musicDownloader.downloadSong(url, function(callback) {
              if (callback === false) return(message.channel.send("Error while downloading file."));
              server.queue.push({
                url: url,
                title: results[0].title,
                file: callback
              });
              message.channel.send(`[Music] Found only one video. Added \`${results[0].title}\` to the queue.`);
              if (!message.guild.voiceConnection) message.member.voiceChannel.join()
                .then(connection => {
                  musicPlayer.play(connection, message);
                });
            });
            return;
          }
          let msgText = "[Music] Select from one of the following results by clicking on a reaction:\n";
          for (var i = 0; i < results.length; i++) {
            msgText += `**${i + 1}.** ${results[i].title} \n`;
          }
          message.channel.send(msgText)
            .then(async (msg) => {
              switch (results.length) {
                case 3:
                  for (emoji of ["1⃣", "2⃣", "3⃣", "❌"]) {
                    await msg.react(emoji);
                  }
                  break;
                case 2:
                  for (emoji of ["1⃣", "2⃣", "❌"]) {
                    await msg.react(emoji);
                  }
                  break;
                default:
              }
              const collector = msg.createReactionCollector(
                (reaction, user) => user.id === message.author.id,
                {time: 30000}
              );
              collector.on("collect", r => {
                if (r.emoji.name === "❌") {
                  msg.clearReactions();
                  msg.edit(`[Music] Search canceld.`);
                }
                let vote = getVote(r.emoji.name);
                if (vote) {
                  collector.stop();
                  let video = results[vote - 1];
                  let url = `https://www.youtube.com/watch?v=${video.id}`;
                  msg.clearReactions();
                  musicDownloader.downloadSong(url, function(callback) {
                    if (callback === false) return(message.channel.send("Error while downloading file."));
                    server.queue.push({
                      url: url,
                      title: video.title,
                      file: callback
                    });
                    msg.edit(`[Music] \`${video.title}\` \`(${url})\` has been added to the queue.`);
                    if (!message.guild.voiceConnection) message.member.voiceChannel.join()
                      .then(connection => {
                        musicPlayer.play(connection, message);
                      });
                  });
                }
              });
              collector.on("end", r => {
                msg.clearReactions();
              });
            });
        });
      }
    }
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
  usage: "play <youtube-link>"
};
