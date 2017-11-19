const inquirer = require("inquirer");
const fs = require("fs");

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
  }
];

console.log("This little script will ask you for some information needed to make the bot work properly.");

inquirer.prompt(prompts).then(answers => {
  let settings = JSON.stringify(answers, null, 2);
  fs.writeFile("./config/settings.json", settings, function(err) {
    if(err) return console.log("There was an error creating the settings file. " + err);
    console.log("Settings saved in ./config/settings.json");
    console.log('You can start the bot using "npm start"');
  });
});