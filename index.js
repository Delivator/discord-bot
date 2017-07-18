const Discord = require("discord.js");
const client = new Discord.Client();
const settings = require("./config/settings.json");

client.on("ready", () => {
  console.log(`Bot ready! Logged in as ${client.user.tag}\\${client.user.id}`);
});

client.on("message", message => {
  var author = message.author,
      channel = message.channel,
      content = message.content,
      guild = message.guild;

  if (content.startsWith(settings.cmd_prefix) && author != client.user) {
    let cmd = content.substring(settings.cmd_prefix.length).split(" ")[0].toLowerCase(),
        args = content.split(" ").slice(1);
    console.log(`Command ${cmd} used by ${author.tag}`);
    switch (cmd) {
      case "ping":
        let startTime = message.createdTimestamp;
        channel.send("Pong!")
          .then(msg => {
            let secondTime = msg.createdTimestamp;
            msg.edit(`There is a **${secondTime - startTime}ms** delay.`)
          });
        break;
      default:

    }
  }
});

client.login(settings.token);
