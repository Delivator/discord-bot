exports.run = function(client, message, args) {
  let startTime = message.createdTimestamp;
  message.channel.send("Pong!")
    .then(msg => {
      let secondTime = msg.createdTimestamp;
      msg.edit(`It took **${secondTime - startTime}ms** from receiving the command to sending this answer.\n`+
               `Client ping: **${client.ping}ms**.`)
    });
};
