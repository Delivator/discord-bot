const got = require("got");
const log = require("../util/logFunction");
const { RichEmbed } = require('discord.js');

function statusToColor(status) {
  switch (status) {
    case 1:
      return "#32ac3f";
      break;
    case 3:
      return "#fab01d";
      break;
    default:
      return "#4f545c";
      break;
  }
}

exports.run = (client, message, args) => {
  let url = "https://www.rockstargames.com/rockstarsupport2a/status.json?locale=de"

  got(url)
    .then(response => {
      let status = JSON.parse(response.body);
      let desc = `${status.services[0].name} Status: **${status.services[0].service_status.status}**\n` +
                 `${status.services[3].name} Status: **${status.services[3].service_status.status}**`;
      const embed = new RichEmbed()
        .setTitle("GTA Online Serverstatus:")
        .setURL("https://support.rockstargames.com/hc/en-us/articles/200426246")
        .setColor(statusToColor(status.services[0].service_status_id))
        .setDescription(desc);
      message.channel.send({embed});
    })
    .catch(err => {
      log.error(err);
    })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "gtastatus",
  description: "Displays the current status of the GTA 5 Services.",
  usage: "gtastatus"
};
