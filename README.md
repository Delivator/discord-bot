# Setup

Requirements:

 * [Node.js](https://nodejs.org/en/download/) version 6.11.2 or higher
 * [FFmpeg](https://github.com/FFmpeg/FFmpeg) installed and added to PATH

Installation:

 * Clone or download this repository
 * Install the dependencies with npm install
 * Copy the `config/example_settings.json` file to `config/settings.json`
 * Edit the `config/settings.json` file
 * Start the bot by typing `node index.js` in the terminal or on windows by starting the `START.bat` file

Config:

* `token` Discord bot user token, can be found/created [here](https://discordapp.com/developers/applications/me)
* `youtubeApiKey` Create a new Project, enable the YouTube Data API v3 and create and copy the API-Key from the [Google Developers Console](https://console.developers.google.com/projectselector/apis/api/youtube.googleapis.com/overview) page
* `prefix` The prefix you want to use before every command. Eg. `"prefix": "+#"` would mean `+#help`
* `ownerid` The discord user ID of the bot owner
* `modrolename`
* `adminrolename`
* `autopause` Boolean; Whether the music bot should pause if noone is in the voicechannel
