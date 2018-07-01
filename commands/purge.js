exports.run = (client, message, args) => {
  if (!args[0] || args[0] > 100) return message.channel.send("Please provide a number from 0 to 100 as the first argument.");
  let messageCount = parseInt(args[0]) + 1;
  message.channel.fetchMessages({ limit: messageCount })
    .then(messages => message.channel.bulkDelete(messages));
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 3
};

exports.help = {
  name: "purge",
  description: "Purges a specified amount of messages from the channel it has been executed in.",
  usage: "purge <number>"
};
