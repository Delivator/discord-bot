const settings = require("../config/settings.json");

module.exports = message => {
  const author = message.author,
        channel = message.channel,
        content = message.content,
        guild = message.guild,
        client = message.client;
  if (content.startsWith(settings.cmd_prefix) && !author.bot) {
    const cmd = content.substring(settings.cmd_prefix.length).split(" ")[0].toLowerCase(),
          args = content.split(" ").slice(1);

    try {
      console.log(`Command ${cmd} used by ${author.tag}`);
      let cmdFile = require(`../commands/${cmd}`);
      cmdFile.run(client, message, args);
    } catch (e) {
      console.log(`Command ${cmd} failed\n${e.stack}`);
    }
  }

};
