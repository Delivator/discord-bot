exports.run = (client, message, args) => {
  let command;
  if (client.commands.has(args[0])) {
    command = args[0];
  } else if (client.aliases.has(args[0])) {
    command = client.aliases.get(args[0]);
  }
  if (!command) {
    return message.channel.send(`Command \`${args[0]}\` could not be found.`);
  } else {
    return message.channel.send(`Reloading Command \`${command}\`.`)
      .then(m => {
        client.reload(command)
          .then(() => {
            m.edit(`Successfully reloaded Command \`${command}\`.`)
          })
          .catch(e => {
            m.edit(`Command \`${command}\` reload failed:\n\`\`\`${e.stack}\`\`\``);
          });
      });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["r"],
  permLevel: 4
};

exports.help = {
  name: "reload",
  description: "Reloads the command filem, if it's been updated, added or modified.",
  usage: "reload <commandname>"
};
