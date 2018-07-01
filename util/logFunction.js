const moment = require("moment");
const chalk = require("chalk");

const log = msg => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${msg}`);
};

log.good = msg => {
  log(chalk.green(msg));
};

log.warn = msg => {
  log(chalk.yellow(msg));
};

log.error = error => {
  log(chalk.red("Error:"));
  console.error(error);
};

log.url = msg => {
  log(chalk.blue(msg));
};

module.exports = log;
