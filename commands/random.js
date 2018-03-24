function getRandom(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

exports.run = (client, message, args) => {
  let min, max;
  if (!args[0]) {
    min = 0;
    max = 100;
  } else {
    if (!isNaN(args[0]) && !isNaN(args[1])) {
      if (args[0] > args[1]) return message.channel.send("The second number muste be larger than the first.");
      min = parseInt(args[0]);
      max = parseInt(args[1]);
    }
  }
  let random = getRandom(min, max);
  message.channel.send(`Here is your random number from ${min} to ${max}: \`${random}\`.`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["rng"],
  perLevel: 0
};

exports.help = {
  name: "random",
  description: "Generates a random number. Default 0-100.",
  usage: "random [number] [number]"
};