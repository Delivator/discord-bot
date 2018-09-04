const settings = require("../config/settings.json");
const musicPlayer = require("../util/musicPlayer");

module.exports = (oldMember, newMember) => {
  if (settings.autopause === false) return;

  const oldChannel = oldMember.voiceChannel;
  const newChannel = newMember.voiceChannel;

  // when a user leaves the bot's voice channel
  if (oldChannel && oldChannel.guild.voiceConnection && oldChannel.guild.voiceConnection.channel === oldChannel) {
    const connection = oldChannel.guild.voiceConnection;
    const members = oldChannel.members.size - 1;
    if (members < 1) {
      musicPlayer.pause(connection);
    }
  }

  // when a user joins the bot's voice channel
  if (newChannel && newChannel.guild.voiceConnection && newChannel.guild.voiceConnection.channel === newChannel) {
    const connection = newChannel.guild.voiceConnection;
    const members = newChannel.members.size - 1;
    if (members > 0) {
      musicPlayer.resume(connection);
    }
  }
};