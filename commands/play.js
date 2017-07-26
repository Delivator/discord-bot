const settings = require("../config/settings.json");
const musicPlayer = require("../util/musicPlayer");

exports.run = (client, message, args) => {
  if (!args[0]) {
    message.channel.send(`Please provide a link! Use \`${settings.prefix}help play\` for more information.`);
  } else {
    if (!message.member.voiceChannel) {
      message.channel.send("You have to be in a voice channel to use this command.");
    } else {
      if (!musicPlayer.servers[message.guild.id]) musicPlayer.servers[message.guild.id] = {
        queue: []
      };
      let server = musicPlayer.servers[message.guild.id];
      server.queue.push(args[0]);
      if (!message.guild.voiceConnection) message.member.voiceChannel.join()
        .then(connection => {
          musicPlayer.play(connection, message);
        });
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
