const settings = require("../config/settings.json");
const pr0gramm = require("../util/pr0gramm.js");
const { RichEmbed } = require('discord.js');

module.exports = message => {
  if (message.content.includes("pr0gramm.com")) {
    let msgSplit = message.content.split(" ");
    for (var i = 0; i < msgSplit.length; i++) {
      if (msgSplit[i].startsWith("http://pr0gramm.com/") || msgSplit[i].startsWith("https://pr0gramm.com/")) {
        let postID = msgSplit[i].split("/")[msgSplit[i].split("/").length - 1];
        let pr0Channel = message.guild.client.channels.find("name", "nsfw-pr0gramm");

        pr0gramm.getPostInfo(postID, function(postInfo) {
          if (pr0Channel) {
            if (message.channel === pr0Channel) return;
            let text = `:thumbsup: **Upvotes:** ${postInfo.up} `+
                       `:thumbsdown: **Downvotes:** ${postInfo.down}\n`+
                       `:cucumber: **Benis:** ${postInfo.up - postInfo.down}\n`+
                       `:bust_in_silhouette: **Uploader:** ${postInfo.user}\n`+
                       `:hash: **Tags (${postInfo.tags.length})**: ${postInfo.topTags}`;
            let links = `:link: **Post-URL:**\nhttp://pr0gramm.com/new/${postInfo.id}\n`+
                        `:frame_photo:️ **Media-URL:**\n${postInfo.mediaUrl}\n`;
            let imageLink = "";
            if (postInfo.full) {
                links += `:mag: \n**Full-Link:** ${postInfo.full}`;
                imageLink = postInfo.full;
            }
            const embed = new RichEmbed()
              .setTitle("Post Info:")
              .setAuthor(postInfo.user, "http://i.imgur.com/Rl5mnyG.png", "http://pr0gramm.com/user/" + postInfo.user)
              .setFooter("© pr0gramm.com")
              .setColor("#ee4d2e")
              .setDescription(text)
              .setImage(postInfo.mediaUrl)
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
          }
        });
      }
    }
  }

  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(settings.prefix)) return;
  let command = message.content.split(" ")[0].slice(settings.prefix.length);
  let args = message.content.split(" ").slice(1);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, args, perms);
  }
};
