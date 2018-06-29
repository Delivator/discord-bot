const log = require("../util/logFunction");
const { RichEmbed } = require('discord.js');
const settings = require("../config/settings.json");

exports.run = (client, message, args) => {
  const guildMember = message.guild.member(message.author);
  const members = message.mentions.members;
  const botRole = message.guild.me.roles.filterArray((role) => {
    return role.managed;
  })[0];

  function removeColor(member) {
    const roles = member.roles.filter((role) => {
      return role.name.startsWith("#");
    });

    roles.forEach((role) => {
      member.removeRole(role, `[Color] removed (msg-id: ${message.id})`)
        .then(() => {
          if (role.members.size < 1) {
            role.delete("[Color] Unused color")
              .then(() => {
                message.channel.send("Color removed.");
              })
              .catch(log.error);
          }
        })
        .catch((error) => {
          log.error(error);
          if (error.code === 50013) message.channel.send('`Error: "Missing Permissions"`\n Make sure the bot\'s role is placed above the color roles.');
        });
    });
    return roles.size;
  }

  function addColor(color, member) {
    let role = message.guild.roles.find("name", color);

    if (role) {
      member.addRole(role, `[Color] color change (msg-id: ${message.id})`)
        .then(() => {
          message.channel.send("Color changed!");
        })
        .catch(log.error);
    } else {
      message.guild.createRole({
        name: color,
        color: color,
      }, `[Color] new color (msg-id: ${message.id})`)
        .then((role) => {
          role.setPosition(botRole.calculatedPosition - 1)
            .catch(log.error);
          member.addRole(role, `[Color] color change (msg-id: ${message.id})`)
            .then(() => {
              message.channel.send("Color changed!");
            })
            .catch(log.error);
        })
        .catch(log.error);
    }
  }

  if (args[0] === "help") {
    const embed = new RichEmbed()
      .setDescription(`This tool or the examples below may help you to select a color: https://dlvtr.tk/colorpicker\nUse ${settings.prefix}color <#HexCode> to change your color.`)
      .setImage("https://i.imgur.com/g4P3wag.png");
    message.channel.send({ embed: embed });
  } else if (!args[0] || args[0] === "clear") {
    if (members.size === 1) {
      if (client.elevation(message) < 2) return message.channel.send("Insufficient permissions!");
      const member = members.first();
      removeColor(member);
    } else {
      removeColor(guildMember);
    }
  } else {
    let color = args[0].toUpperCase();
    const colorCheck = /^#{0,1}[0-9A-F]{6}$/;

    if (!colorCheck.test(color)) return message.channel.send("Please provide a valid hex color code (eg. #88be76). Try this color picker: <https://dlvtr.tk/colorpicker>");

    if (!color.startsWith("#")) color = "#" + color;

    if (members.size === 1) {
      if (client.elevation(message) < 2) return message.channel.send("Insufficient permissions!");
      const member = members.first();
      removeColor(member);
      addColor(color, member);
    } else {
      removeColor(guildMember);
      addColor(color, guildMember);
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["colour"],
  permLevel: 0
};

exports.help = {
  name: "color",
  description: "Changes the users name color.",
  usage: "color [<hex color code>/clear/help]"
};
