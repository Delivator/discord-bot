const fs = require("fs");
const log = require("./util/logFunction");
const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("youtube-dl.js");
if (fs.existsSync("./config/settings.json")) {
  log("settings.json loaded.");
} else {
  log("settings.json file missing. Check https://github.com/Delivator/discord-bot#setup");
  process.exit(1);
}
const settings = require("./config/settings.json");
require("./util/eventLoader")(client);
if (settings.webinterface) require("./util/webserver").run(client);

client.startTime = new Date().getTime();

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.musicQueue = new Discord.Collection();

if (!fs.existsSync("./.cache")) fs.mkdirSync("./.cache");

ytdl.updateBinary()
  .then(output => {
    log(`[ytdl] Updated binary to version ${output.version} in ${output.time}s`);
  })
  .catch(log.error);

fs.readdir("./commands/", (err, files) => {
  if (err) log.error(err);
  log(`Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    log(`Loading Command: ${props.help.name}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      log.good(`Reloaded command: ${command}`);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  let permlvl = 0;

  if (message.author.id === settings.ownerid) permlvl = 4;

  if (message.channel.type === "dm") return permlvl;

  let admin_role = message.guild.roles.find(role => role.name === settings.adminrolename);
  if (admin_role && message.member.roles.has(admin_role.id)) permlvl = 3;

  let mod_role = message.guild.roles.find(role => role.name === settings.modrolename);
  if (mod_role && message.member.roles.has(mod_role.id)) permlvl = 2;

  return permlvl;
};

client.login(settings.token);
