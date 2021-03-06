const
  Client = require('ftp'),
  logger = require('../lib/log');

module.exports = function(config) {

  this.upload = function(file, filename, callback) {

    var client = new Client();

    client.on('ready', function(err) {

      logger.debug('Uploading ' + filename + ' to ' + config.ftp.directory);

      client.put(file, config.ftp.directory + filename, function(err) {
        if (err) return console.error(err);

        logger.info('Uploaded ' + filename);

        var chmodCommand = 'chmod ' + config.ftp.filePermission + ' ' + config.ftp.directory + filename;

        client.site(chmodCommand, function(err, responseText, responseCode) {
          if (err) return console.error(err);

          if (responseCode === 200) {
            logger.debug('Set permissions of ' + filename + ' successfully' );

            if (callback) {
              callback(null, filename);
            }
          } else {
            logger.error(responseText);
            callback(responseText, filename);
          }
        })

        client.end();
      });
    });

    client.connect(config.ftp);
  }

  return this;
}