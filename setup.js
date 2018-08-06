const inquirer = require("inquirer");
const fs = require("fs");
const log = require("./util/logFunction");

if (fs.existsSync("./config/settings.json")) {
  log.warn("[discord-bot] settings.json file already exists!");
  process.exit(0);
} else {
  log.warn("[discord-bot] No config found. Running setup.");
}

let prePromts = [
  {
    type: "confirm",
    name: "webinterface",
    default: true,
    message: "Should the webinterface be enabled:"
  }, {
    type: "confirm",
    name: "cleverbot",
    default: true,
    message: "Should the cleverbot be enabled:"
  }
];

let prompts = [
  {
    type: "input",
    name: "token",
    message: "Discord-Bot token:"
  }, {
    type: "input",
    name: "clientsecret",
    message: "Client secret:"
  }, {
    type: "input",
    name: "youtubeApiKey",
    message: "YouTube-API-Key:"
  }, {
    type: "input",
    name: "prefix",
    default: "!",
    message: "Command prefix:"
  }, {
    type: "input",
    name: "ownerid",
    message: "Bot owner-ID:"
  }, {
    type: "input",
    name: "modrolename",
    default: "Moderator",
    message: "Discord mod role name:"
  }, {
    type: "input",
    name: "adminrolename",
    default: "Administrator",
    message: "Discord admin role name:"
  }, {
    type: "confirm",
    name: "autopause",
    default: true,
    message: "Auto pause music bot when he is alone in channel:"
  }, {
    type: "input",
    name: "maxplaylistsize",
    default: 50,
    message: "Max size for YouTube playlists:"
  }, {
    type: "input",
    name: "skipratio",
    default: 0.5,
    message: "How many users are needed to skip a playing song (in %, 0.5 = 50%):"
  }
];

log.warn("[discord-bot] This little script will ask you for some information needed to make the bot work properly.");

inquirer.prompt(prePromts).then(ans => {
  if (ans.webinterface) {
    prompts.push(
      {
        type: "input",
        name: "webServerPort",
        default: 3000,
        message: "The port on which the webserver will run on:"
      }
    );
  }
  if (ans.cleverbot) {
    prompts.push(
      {
        type: "input",
        name: "cleverUser",
        message: "Cleverbot.io API User:"
      }, {
        type: "input",
        name: "cleverKey",
        message: "Cleverbot.io API Key:"
      }
    );
  }

  inquirer.prompt(prompts).then(answers => {
    let settings = JSON.stringify(Object.assign({}, answers, ans), null, 2);
    fs.writeFile("./config/settings.json", settings, (err) => {
      if (err) return log.error("[discord-bot] There was an error creating the settings file:\n" + err);
      log.good("[discord-bot] Settings saved in ./config/settings.json");
      log.good("[discord-bot] You can start the bot using \"npm start\"");
    });
  });
});

