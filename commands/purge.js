exports.run = function(client, message, args) {
  let messageCount = parseInt(args[0]);
  message.channel.fetchMessages({limit: messageCount})
    .then(messages => message.channel.bulkDelete(messages));
};
