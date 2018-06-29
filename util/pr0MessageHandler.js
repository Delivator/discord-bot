const pr0gramm = require("./pr0gramm.js");
const { RichEmbed } = require('discord.js');

function getTopTags(tags) {
  let linkedTags = [];
  if (tags.length < 4) {
    for (var i = 0; i < postInfo.tags.length; i++) {
      linkedTags.push(`[#${tags[i].tag}](https://pr0gramm.com/top/${encodeURI(tags[i].tag)})`);
    }
  } else {
    for (var i = 0; i < 3; i++) {
      linkedTags.push(`[#${tags[i].tag}](https://pr0gramm.com/top/${encodeURI(tags[i].tag)})`);
    }
  }
  return linkedTags.join("•");
}

module.exports = (message) => {
  let nsfwChannel = message.guild.channels.find((channel) => {
    return (channel.name === "nsfw" && channel.type === "text");
  });

  let msgSplit = message.content.split(" ");
  for (var i = 0; i < msgSplit.length; i++) {
    let postID = msgSplit[i].split("/")[msgSplit[i].split("/").length - 1];
    if (msgSplit[i].startsWith("http://pr0gramm.com/") || msgSplit[i].startsWith("https://pr0gramm.com/")) {
      pr0gramm.getPostInfo(postID, function (postInfo) {
        let text = `:thumbsup:**: ${postInfo.up}** ` +
          `:thumbsdown:**: ${postInfo.down}**\n` +
          `:cucumber: **Benis:** ${postInfo.up - postInfo.down}\n` +
          `:bust_in_silhouette: **Uploader:** [${postInfo.user}](https://pr0gramm.com/user/${postInfo.user})\n` +
          `:hash: **Tags (${postInfo.tags.length})**: ${getTopTags(postInfo.tags)}\n` +
          `:link: **Post URL:** [/new/${postInfo.id}](https://pr0gramm.com/new/${postInfo.id})\n` +
          `:frame_photo:️ **Media URL:**\n${postInfo.fileType === "image" ? postInfo.mediaUrl : ""}\n`;
        let imageLink = "";
        if (postInfo.full) {
          text += `:mag: **Full-Image URL:** ${postInfo.full}`;
          imageLink = postInfo.full;
        } else if (postInfo.fileType === "image") {
          imageLink = postInfo.mediaUrl;
        } else {
          imageLink = "";
        }
        const embed = new RichEmbed()
          .setAuthor(postInfo.user, "https://i.imgur.com/Rl5mnyG.png", "https://pr0gramm.com/user/" + postInfo.user)
          .setFooter("© pr0gramm.com - Uploaded at:")
          .setColor("#ee4d2e")
          .setDescription(text)
          .setImage(imageLink)
          .setThumbnail(postInfo.thumb)
          .setTimestamp(new Date(postInfo.created * 1000))
          .setURL("https://pr0gramm.com/new/" + postInfo.id);
        let channel = message.channel;
        if (postInfo.flags != "1" && nsfwChannel) {
          message.reply(`your message has been moved to the <#${nsfwChannel.id}>-channel.`)
            .then((msg) => {
              msg.delete(5000);
            });
          channel = nsfwChannel;
        }
        channel.send({ embed })
          .then((msg) => {
            if (postInfo.fileType === "video") {
              channel.send(postInfo.mediaUrl);
            }
          });
      });
    }
  }
};
