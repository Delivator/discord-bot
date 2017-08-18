exports.run = (client, message, args) => {
  let channel = args[args.length - 1];
  if (message.guild.channels.get(channel) && message.guild.channels.get(channel).type === "voice") {
    channel = message.guild.channels.get(channel);
  } else if (message.guild.channels.find(c => c.name === channel && c.type === "voice")) {
    channel = message.guild.channels.find(c => c.name === channel && c.type === "voice");
  } else {
    return message.channel.send(`Voice-Channel \`${channel}\` not found!`);
  }
  for (const member of message.mentions.members.values()) {
    if (!member.voiceChannel) {
      message.channel.send(`\`${member.user.tag}\` is not in a voice-channel.`)
        .then(msg => msg.delete(5000));
    } else if(member.voiceChannelID && member.voiceChannelID === channel.id) {
      message.channel.send(`\`${member.user.tag}\` is already in the desired channel.`)
        .then(msg => msg.delete(5000));
    } else {
      member.setVoiceChannel(channel);
    }
  };
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: "move",
  description: "move",
  usage: "move <user(s)> <voicechannel (id/name)>"
};
