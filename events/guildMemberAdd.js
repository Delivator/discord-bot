const Discord = require("discord.js");

module.exports = member => {
  let guild = member.guild;
  let logChannel = member.client.channels.find("name", "admin-log");
  guild.defaultChannel.send(`Welcome <@${member.user.id}> to the \`${guild.name}\` server!`);
  if (logChannel) {
    const description = `:bust_in_silhouette: User: ${member.user.tag}\n`+
                        `:id: ID: ${member.user.id}`;
    const embed = new Discord.RichEmbed()
      .setTitle("User joined")
      .setColor("#00ff00")
      .setDescription(description)
      .setThumbnail(member.user.displayAvatarURL)
      .setTimestamp(new Date());
    logChannel.send({embed});
  } else {
    console.log(`[Admin] [${guild.name}] User "${member.user.tag}" has joined the server!`);
  }
};
