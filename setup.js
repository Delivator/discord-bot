const inquirer = require("inquirer");
const fs = require("fs");
const log = require("./util/logFunction");
const version = require(__dirname + "/package.json").version;

function versionToInt(version) {
  let ver = 0;
  version.split(".").forEach(num => {
    ver += parseInt(num);
  });
  return ver;
}

let prompts = [
  {
    type: "input",
    name: "token",
    message: "Discord-Bot token:"
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
  }, {
    type: "confirm",
    name: "webinterface",
    default: false,
    message: "Should the webinterface be enabled:"
  }, {
    type: "input",
    name: "webServerPort",
    default: 3000,
    message: "The port on which the webserver will run on:",
    when: function (answers) {
      return answers.webinterface;
    }
  }, {
    type: "input",
    name: "clientSecret",
    message: "Client secret:",
    when: function (answers) {
      return answers.webinterface;
    }
  }, {
    type: "input",
    name: "hostname",
    message: "Hostname for api the api redirect url. (URL will be http://{hostname}/api/discord/callback):",
    when: function (answers) {
      return answers.webinterface;
    }
  }, {
    type: "confirm",
    name: "cleverbot",
    default: false,
    message: "Should the cleverbot be enabled:"
  }, {
    type: "input",
    name: "cleverUser",
    message: "Cleverbot.io API User:",
    when: function (answers) {
      return answers.cleverbot;
    }
  }, {
    type: "input",
    name: "cleverKey",
    message: "Cleverbot.io API Key:",
    when: function (answers) {
      return answers.cleverbot;
    }
  }
];

function loadSettings(settings) {
  for (let i = 0; i < prompts.length; i++) {
    const q = prompts[i];
    if (settings[q.name]) prompts[i].default = settings[q.name];
  }
}

if (fs.existsSync(__dirname + "/config/settings.json")) {
  const settings = require(__dirname + "/config/settings.json");
  if (!settings.version || versionToInt(settings.version) < versionToInt(version)) {
    log.warn("[discord-bot] [setup] Settings file found! Your current settings will be used as defaults.");
    loadSettings(settings);
  } else if (settings.version && versionToInt(settings.version) >= versionToInt(version)) {
    log.warn("[discord-bot] [setup] settings.json file already and up to date!");
    process.exit(0);
  }
} else {
  log.warn("[discord-bot] [setup] No config found. Running setup.");
}

log.warn("[discord-bot] [setup] This little script will ask you for some information needed to make the bot work properly.");

inquirer.prompt(prompts)
  .then(answ => {
    let answers = Object.assign({ version }, answ);
    let settings = JSON.stringify(answers, null, 2);
    fs.writeFile("./config/settings.json", settings, (err) => {
      if (err) return log.error("[discord-bot] [setup] There was an error creating the settings file:\n" + err);
      log.good("[discord-bot] [setup] Settings saved in ./config/settings.json");
      log.good("[discord-bot] [setup] You can start the bot by running \"npm start\"");
    });
  })
  .catch(err => {
    log.error(err);
  });

