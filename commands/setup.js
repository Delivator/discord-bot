exports.run = (client, message) => {
  message.channel.send("This function is not working yet :pensive:");
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 3
};

exports.help = {
  name: "setup",
  description: "Runs a setup, if the bot is new to the server.",
  usage: "setup"
};
