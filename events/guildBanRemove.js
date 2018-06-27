const Discord = require("discord.js");

module.exports = (guild, user) => {
  let logChannel = guild.client.channels.find("name", "mod-log");
  if (logChannel) {
    const description = `:bust_in_silhouette: User: ${user.tag}\n` +
      `:id: ID: ${user.id}`;
    const embed = new Discord.RichEmbed()
      .setTitle("User unbanned")
      .setColor("#ffff00")
      .setDescription(description)
      .setThumbnail(user.displayAvatarURL)
      .setTimestamp(new Date());
    logChannel.send({ embed });
  } else {
    console.log(`[Admin] [${guild.name}] User "${user.tag}" has been unbanned!`);
  }
};
