const settings = require("../config/settings.json");

exports.run = function(client, message, args) {
  if (!args[0]) {
    const commandNames = Array.from(client.commands.keys());
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    message.channel.send(`== Command list ==\n\n` +
                         `[Use ${settings.prefix}help <command> for details]\n\n` +
                         `${client.commands.map( c => `${settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}`).join("\n")}`, { code: "asciidoc" });
  } else {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      message.channel.send(`== ${command.help.name} ==\n\n${command.help.description}\n\nUsage::${command.help.usage}`, { code: "asciidoc" });
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "???"],
  permLevel: 0
};

exports.help = {
  name: "help",
  description: "Displays all available commands for your permission level.",
  usage: "help <help>"
};
