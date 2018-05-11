const got = require("got");
const log = require("./logFunction");
const settings = require("../config/settings.json");

module.exports = (message) => {
  let url = "https://cleverbot.io/1.0/ask";
  let options = {
    json: true,
    body: {
      user: settings.cleverUser,
      key: settings.cleverKey,
      nick: message.client.user.id,
      text: message.content
    }
  };
  message.channel.startTyping();
  got.post(url, options)
    .then(resp => {
      if (resp.body.status === "success") {
        message.channel.send(resp.body.response);
        message.channel.stopTyping();
      }
    })
    .catch(err => {
      if (err.response.statusCode === 400 && err.response.body.status.includes("Session not initialized")) {
        got.post("https://cleverbot.io/1.0/create", {
          json: true,
          body: {
            user: settings.cleverUser,
            key: settings.cleverKey,
            nick: message.client.user.id
          }
        }).then(resp => {
          message.channel.send("`Session successfully created, you can now use the bot normally!`")
        })
        .catch(err => {
          log.error(err);
          console.log(err);
        });
      } else {
        log.error(err);
      }
    });
};