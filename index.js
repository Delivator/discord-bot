const Discord = require("discord.js");
const client = new Discord.Client();
const settings = require("./config/settings.json");
require("./util/eventLoader")(client);

var reload = (message, cmd) => {
	delete require.cache[require.resolve('./commands/' + cmd)];
	try {
		let cmdFile = require('./commands/' + cmd);
	} catch (err) {
		message.channel.send(`Problem loading ${cmd}: ${err}`).then(
			response => response.delete(5000).catch(error => console.log(error.stack))
		).catch(error => console.log(error.stack));
	}
	message.channel.send(`${cmd} reload was a success!`).then(
		response => response.delete(5000).catch(error => console.log(error.stack))
	).catch(error => console.log(error.stack));
};
exports.reload = reload;

client.login(settings.token);
