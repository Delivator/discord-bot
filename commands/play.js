const settings = require("../config/settings.json");
const musicPlayer = require("../util/musicPlayer");
const ytSearch = require("youtube-search");

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
        const options = {
          maxResults: 1,
          part: "snippet",
          type: "video",
          key: settings.youtubeApiKey
        };
        ytSearch(videoID, options, function(err, results) {
          if (err) return console.log(err);
          let video = results[0];
          server.queue.push({
            url: `https://www.youtube.com/watch?v=${video.id}`,
            title: video.title
          });
          message.channel.send(`[Music] \`${video.title}\` \`(https://www.youtube.com/watch?v=${video.id})\` has been added to the queue.`);
          if (!message.guild.voiceConnection) message.member.voiceChannel.join()
            .then(connection => {
              musicPlayer.play(connection, message);
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
            message.channel.send(`[Music] Found only one video. Added \`${results[0].title}\` to the queue.`);
            server.queue.push({
              url: `https://www.youtube.com/watch?v=results[0]`,
              title: results[0].title
            });
            if (!message.guild.voiceConnection) message.member.voiceChannel.join()
              .then(connection => {
                musicPlayer.play(connection, message);
              });
            return;
          }
          let msgText = "[Music] select from one of the following results:\n";
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
                  msg.clearReactions();
                  msg.edit(`[Music] \`${video.title}\` \`(https://www.youtube.com/watch?v=${video.id})\` has been added to the queue.`);
                  server.queue.push({
                    url: `https://www.youtube.com/watch?v=${video.id}`,
                    title: video.title
                  });
                  if (!message.guild.voiceConnection) message.member.voiceChannel.join()
                    .then(connection => {
                      musicPlayer.play(connection, message);
                    });
                }
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
