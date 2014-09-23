const
  logger = exports,
  colours = require('colors');

const levels = ['error', 'warn', 'info', 'debug'];

logger.debugLevel = 'debug';

colours.setTheme({
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  trace: 'blue',
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
      case 'trace':
        console.log('[' + level + '] ' + message.trace);
        break;
      case 'verbose':
        console.log('[' + level + '] ' + message.verbose);
        break;
      case 'debug':
        console.log('[' + level + '] ' + message.debug);
        break;
      case 'info':
        console.log('[' + level + '] ' + message.info);
        break;
      case 'warn':
        console.log('[' + level + '] ' + message.warn);
        break;
      case 'error':
        console.log('[' + level + '] ' + message.error);
        break;
      default:
        console.log('[' + level + '] ' + message.verbose);
    }
  }
}

logger.trace = function (message) {
  logger.log('trace', message);
}

logger.verbose = function (message) {
  logger.log('verbose', message);
}

logger.debug = function (message) {
  logger.log('debug', message);
}

logger.info = function (message) {
  logger.log('info', message);
}

logger.warn = function (message) {
  logger.log('warn', message);
}

logger.error = function (message) {
  logger.log('error', message);
}