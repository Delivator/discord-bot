@echo off

if exist config/settings.json (
  echo Starting discord bot...
  node index.js
) else (
	echo settings.json file is missing. Check https://github.com/Delivator/discord-bot#setup
)

pause