exports.run = (client, message) => {
  let startTime = message.createdTimestamp;
  message.channel.send("Pong!")
    .then(msg => {
      let secondTime = msg.createdTimestamp;
      msg.edit(`It took **${secondTime - startTime}ms** from receiving the command to sending this answer.\n` +
        `Client ping: **${client.ping}ms**.`)
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "ping",
  description: "Ping command. Thats all. Nothing special.",
  usage: "ping"
};
