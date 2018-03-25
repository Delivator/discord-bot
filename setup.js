const inquirer = require("inquirer");
const fs = require("fs");

if (fs.existsSync("./config/settings.json")) {
  return console.log("[discord-bot] settings.json file already exists!");
} else {
  console.log("[discord-bot] No config found. Running setup.");
}

let prompts = [
  {
    type: "input",
    name: "token",
    message: "Discord-Bot token:"
  },
  {
    type: "input",
    name: "youtubeApiKey",
    message: "YouTube-API-Key:"
  },
  {
    type: "input",
    name: "prefix",
    default: "!",
    message: "Command prefix:"
  },
  {
    type: "input",
    name: "ownerid",
    message: "Bot owner-ID:"
  },
  {
    type: "input",
    name: "modrolename",
    default: "Moderator",
    message: "Discord mod role name:"
  },
  {
    type: "input",
    name: "adminrolename",
    default: "Administrator",
    message: "Discord admin role name:"
  },
  {
    type: "confirm",
    name: "autopause",
    default: true,
    message: "Auto pause music bot when he is alone in channel:"
  },
  {
    type: "input",
    name: "maxplaylistsize",
    default: 50,
    message: "Max size for YouTube playlists:"
  },
  {
    type: "input",
    name: "skipratio",
    default: 0.5,
    message: "How many users are needed to skip a playing song (in %, 0.5 = 50%):"
  },
  {
    type: "input",
    name: "webServerPort",
    default: 3000,
    message: "The port on which the webserver will run on: "
  }
];

console.log("[discord-bot] This little script will ask you for some information needed to make the bot work properly.");

inquirer.prompt(prompts).then(answers => {
  let settings = JSON.stringify(answers, null, 2);
  fs.writeFile("./config/settings.json", settings, function(err) {
    if(err) return console.log("[discord-bot] There was an error creating the settings file. " + err);
    console.log("[discord-bot] Settings saved in ./config/settings.json");
    console.log('[discord-bot] You can start the bot using "npm start"');
  });
});