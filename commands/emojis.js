exports.run = (client, message) => {
  let emojis = message.guild.emojis;
  let msg = `All custom emojis on this server (${emojis.size}): \n\n`;
  emojis.forEach(emoji => {
    msg += `${emoji.toString()} \`:${emoji.name}:\`\n`;

  });
  message.channel.send(msg);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "emojis",
  description: "Lists all emojis on this server.",
  usage: "emojis"
};
