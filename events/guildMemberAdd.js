const Discord = require("discord.js");

module.exports = (member) => {
  let general = member.guild.channels.find("name", "general");
  let logChannel = member.guild.channels.find("name", "mod-log");
  if (general) general.send(`Welcome <@${member.user.id}> to the \`${member.guild.name}\` server!`);
  if (logChannel) {
    const embed = new Discord.RichEmbed()
      .setTitle("User joined")
      .setColor("#00ff00")
      .setDescription(`:bust_in_silhouette: User: ${member.user.tag}\n:id: ID: ${member.user.id}`)
      .setThumbnail(member.user.displayAvatarURL)
      .setTimestamp(new Date());
    logChannel.send({ embed });
  }
};
