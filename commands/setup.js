exports.run = (client, message, args) => {
  message.channel.send(`This function is not working yet :pensive:`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 3
};

exports.help = {
  name: "setup",
  description: "Runs a setup, if the bot is new to the server.",
  usage: "setup"
};
