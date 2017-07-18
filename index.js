const Discord = require("discord.js");
const client = new Discord.Client();
const settings = require("./config/settings.json");

client.on("ready", () => {
  console.log(`Bot ready! Logged in as ${client.user.tag}\\${client.user.id}`);
});

client.on("message", message => {
  var author = message.author,
      channel = message.channel,
      content = message.conten,
      guild = message.guild;

  if (conten.startsWith(settings.cmd_prefix) && author != client.user) {
    var cmd = conten.substring(settings.cmd_prefix.length).split(" ")[0];
    console.log(cmd);
  }
});

client.login(settings.token);
