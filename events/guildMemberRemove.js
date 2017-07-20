const Discord = require("discord.js");

module.exports = member => {
  let guild = member.guild;
  let logChannel = member.client.channels.find("name", "admin-log");
  guild.defaultChannel.send(`<@${member.user.id}> left the server! :sleepy:`);
  if (logChannel) {
    const description = `:bust_in_silhouette: User: ${member.user.tag}\n`+
                        `:id: ID: ${member.user.id}`
    const embed = new Discord.RichEmbed()
      .setTitle("User left")
      .setColor("#ff0000")
      .setDescription(description)
      .setThumbnail(member.user.displayAvatarURL)
      .setTimestamp(new Date());
    logChannel.send({ embed });
  }
};
