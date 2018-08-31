const Discord = require("discord.js");

module.exports = (guild, user) => {
  const logChannel = guild.channels.find(channel => channel.name === "mod-log");
  if (!logChannel) return;

  const description = `:bust_in_silhouette: User: ${user.tag}\n` +
    `:id: ID: ${user.id}`;
  const embed = new Discord.RichEmbed()
    .setTitle("User banned")
    .setColor("#ff0000")
    .setDescription(description)
    .setThumbnail(user.displayAvatarURL)
    .setTimestamp(new Date());
  logChannel.send({ embed });
};
