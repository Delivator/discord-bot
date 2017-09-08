exports.run = (client, message, args) => {
  if (!args[0]) {
    let random = Math.floor((Math.random() * 100) + 1);
    message.channel.send(`Here is your random number from 1 and 100: \`${random}\``);
  } else {
    if (!isNaN(args[0]) && !isNaN(args[1])) {
      if (args[0] > args[1]) return message.channel.send("The second number muste be lower than the first.");
      let random = Math.floor((Math.random() * args[1]) + args[0]);
      message.channel.send(`Here is your random number: \`${random}\``);
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["rng", "rndm"],
  perLevel: 0
};

exports.help = {
  name: "random",
  description: "Generates a random number. Default 0-100.",
  ussage: "random [number] [number]"
};