const got = require("got");
const log = require("../util/logFunction");
const { RichEmbed } = require("discord.js");

function statusToText(status) {
  switch (status) {
    case 1:
      return "Online";
    case 3:
      return "Maintenance";
    default:
      return "Unknown";
  }
}

function statusToColor(status) {
  switch (status) {
    case 1:
      return "#32ac3f";
    case 3:
      return "#fab01d";
    default:
      return "#4f545c";
  }
}

exports.run = (client, message) => {
  let url = "https://support.rockstargames.com/services/status.json";

  got(url)
    .then(response => {
      let status = JSON.parse(response.body).statuses;
      let desc = `${status.gtao[0].name} Status: **${statusToText(status.gtao[0].service_status_id)}**\n` +
        `${status.sc[0].name} Status: **${statusToText(status.sc[0].service_status_id)}**`;
      const embed = new RichEmbed()
        .setTitle("GTA Online Serverstatus:")
        .setURL("https://support.rockstargames.com/servicestatus")
        .setColor(statusToColor(status.gtao[0].service_status_id))
        .setDescription(desc);
      message.channel.send({ embed });
    })
    .catch(log.error);
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
