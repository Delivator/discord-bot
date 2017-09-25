const settings = require("../config/settings.json");
const pr0MessageHandler = require("../util/pr0MessageHandler.js");

module.exports = message => {
  if (message.content.includes("pr0gramm.com")) {
    pr0MessageHandler.run(message);
  }

  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(settings.prefix)) return;
  let command = message.content.split(" ")[0].toLowerCase().slice(settings.prefix.length);
  let args = message.content.split(" ").slice(1);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return message.channel.send("Insufficient permissions!");
    cmd.run(client, message, args, perms);
  }
};
