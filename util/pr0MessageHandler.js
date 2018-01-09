const pr0gramm = require("./pr0gramm.js");
const { RichEmbed } = require('discord.js');

exports.run = (message) => {
  let pr0Channel = message.guild.channels.find(function(channel) {
    return (channel.name === "pr0gramm" && channel.type === "text");
  });
  if (!pr0Channel) return;

  let msgSplit = message.content.split(" ");
  for (var i = 0; i < msgSplit.length; i++) {
    let postID = msgSplit[i].split("/")[msgSplit[i].split("/").length - 1];
    if (msgSplit[i].startsWith("http://pr0gramm.com/") || msgSplit[i].startsWith("https://pr0gramm.com/")) {
      pr0gramm.getPostInfo(postID, function(postInfo) {
        if (message.channel === pr0Channel) return;
        let text = `:thumbsup: **Upvotes:** ${postInfo.up} `+
                   `:thumbsdown: **Downvotes:** ${postInfo.down}\n`+
                   `:cucumber: **Benis:** ${postInfo.up - postInfo.down}\n`+
                   `:bust_in_silhouette: **Uploader:** [${postInfo.user}](http://pr0gramm.com/user/${postInfo.user})\n`+
                   `:hash: **Tags (${postInfo.tags.length})**: ${postInfo.topTags}`;
        let links = `:link: **Post-URL:**\nhttp://pr0gramm.com/new/${postInfo.id}\n`+
                    `:frame_photo:️ **Media-URL:**\n${postInfo.mediaUrl}\n`;
        let imageLink = "";
        if (postInfo.full) {
            links += `:mag: \n**Full-Link:** ${postInfo.full}`;
            imageLink = postInfo.full;
        } else if (postInfo.fileType === "image") {
          imageLink = postInfo.mediaUrl;
        } else {
          imageLink = "";
        }
        const embed = new RichEmbed()
          .setTitle("Post Info:")
          .setAuthor(postInfo.user, "http://i.imgur.com/Rl5mnyG.png", "http://pr0gramm.com/user/" + postInfo.user)
          .setFooter("© pr0gramm.com")
          .setColor("#ee4d2e")
          .setDescription(text)
          .setImage(imageLink)
          .setThumbnail(postInfo.thumb)
          .setTimestamp(new Date(postInfo.created * 1000))
          .setURL("http://pr0gramm.com/new/" + postInfo.id)
          .addField("Links:", links);
        pr0Channel.send({embed});
        message.delete();
        message.channel.send(`${message.author.toString()}, your message has been moved to the <#${pr0Channel.id}>-channel.`)
          .then(msg => {
            msg.delete(10000);
          });
      });
    }
  }
};
