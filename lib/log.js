var logger = exports,
  colours = require('colors');

var levels = ['error', 'warn', 'info', 'debug'];

logger.debugLevel = 'debug';

colours.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'blue',
  help: 'cyan',
  warn: 'yellow',
  debug: 'grey',
  error: 'red'
});

logger.log = function(level, message) {

  if (levels.indexOf(level) <= levels.indexOf(logger.debugLevel) ) {

    if (typeof message !== 'string') {
      message = JSON.stringify(message);
    }

    switch (level) {
      case 'debug':
        console.log(level + ': ' + message.debug);
        break;
      case 'warn':
        console.log(level + ': ' + message.warn);
        break;
      case 'error':
        console.log(level + ': ' + message.error);
        break;
      default:
        console.log(level + ': ' + message.verbose);
    }
  }
}

logger.verbose = function (message) {
  logger.log('debug', message);
}
logger.debug = function (message) {
  logger.log('debug', message);
}
logger.warn = function (message) {
  logger.log('debug', message);
}
logger.error = function (message) {
  logger.log('debug', message);
}