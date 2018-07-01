const { RichEmbed } = require("discord.js");

function msToTime(s) {
  let ms = s % 1000;
  s = (s - ms) / 1000;
  let secs = s % 60;
  s = (s - secs) / 60;
  let mins = s % 60;
  s = (s - mins) / 60;
  let hrs = s % 24;
  let days = (s - hrs) / 24;
  return { ms: s, s: secs, m: mins, h: hrs, d: days };
}

exports.run = (client, message) => {
  let time = msToTime(new Date().getTime() - client.startTime);
  const embed = new RichEmbed()
    .setDescription("**Bot/Server statistics:**\n\n")
    .setThumbnail(client.user.avatarURL)
    .addField("Bot :robot::", `Name: **${client.user.tag}**\n` +
      `ID: **${client.user.id}**\n` +
      `Currently working for **${client.users.size - 1}** users at **${client.channels.size}** channels in **${client.guilds.size}** servers.\n` +
      `Online since: **${time.d}** days, **${time.h}** hours and **${time.m}** minutes.`);
  message.channel.send({ embed });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["statistics"],
  permLevel: 0
};

exports.help = {
  name: "stats",
  description: "Sends some stats about the bot and the server.",
  usage: "stats"
};
