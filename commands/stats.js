const { RichEmbed } = require('discord.js');

exports.run = (client, message) => {
  const minutes = 1000 * 60,
        hours = minutes * 60,
        days = hours * 24;
  const t = new Date().getTime() - client.startTime;
  const embed = new RichEmbed()
    .setDescription("**Bot/Server statistics:**\n\n")
    .setThumbnail(client.user.avatarURL)
    .addField("Bot :robot::", `Name: **${client.user.tag}**\n` +
                              `ID: **${client.user.id}**\n` +
                              `Avatar: :arrow_upper_right:\n` +
                              `Currently working for **${client.users.size - 1}** users at **${client.channels.size}** channels in **${client.guilds.size}** servers.\n` +
                              `Online since: **${Math.round(t / days)}** days, **${Math.round(t / hours)}** hours, **${Math.round(t / minutes)}** minutes.`);
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
