const Discord = require("discord.js");

module.exports = (member) => {
  let general = member.guild.channels.find(channel => channel.name === "general");
  let logChannel = member.guild.channels.find(channel => channel.name === "mod-log");
  if (general) general.send(`**${member.user.tag}** left the server! :sleepy:`);
  if (logChannel) {
    const embed = new Discord.RichEmbed()
      .setTitle("User left")
      .setColor("#ff7b00")
      .setDescription(`:bust_in_silhouette: User: ${member.user.tag}\n:id: ID: ${member.user.id}`)
      .setThumbnail(member.user.displayAvatarURL)
      .setTimestamp(new Date());
    logChannel.send({ embed });
  }
};
