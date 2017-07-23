exports.run = (client, message, args) => {
  let messageCount = parseInt(args[0]) + 1;
  message.channel.fetchMessages({limit: messageCount})
    .then(messages => message.channel.bulkDelete(messages));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: "purge",
  description: "Purges a specified amount of messages from the channel it has been executed in.",
  usage: "purge <number>"
};
