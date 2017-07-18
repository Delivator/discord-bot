const Discord = require("discord.js");
const client = new Discord.Client();
const settings = require("./config/settings.json");

client.on("ready", () => {
  console.log(`Bot ready! Logged in as ${client.user.tag}\\${client.user.id}`);
});

client.login(settings.token);
