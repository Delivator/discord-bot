const moment = require("moment");
const chalk = require("chalk");

log = msg => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${msg}`);
};

log.good = msg => {
  log(chalk.green(msg));
};

log.warn = msg => {
  log(chalk.yellow(msg));
};

log.error = msg => {
  log(chalk.red(msg));
};

log.link = msg => {
  log(chalk.blue(msg));
}

module.exports = log;
