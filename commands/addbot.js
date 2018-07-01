exports.run = (client, message) => {
  let inviteURL = `<https://discordapp.com/oauth2/authorize?scope=bot&permissions=8&client_id=${client.user.id}>`;
  message.channel.send("You can use this URL to add this bot to you own server:\n" + inviteURL);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["add"],
  permLevel: 0
};

exports.help = {
  name: "addbot",
  description: "Send the URL you can use, to add this bot to your own server.",
  usage: "addbot"
};
