const
  pkgcloud = require('pkgcloud'),
  _ = require('underscore'),
  logger = require('../lib/log');;


module.exports = function(config) {

  this.upload = function(stream, filename, callback) {

    var client = pkgcloud.storage.createClient(config.cdn);

    client.getContainers(function (err, containers) {
      if (err) return console.error(err);

      _.each(containers, function(container) {

        if (container.name === config.cdn.containerName) {

          var options = {
            container: container.name,
            remote: filename
          }

          logger.info('Uploading ' + filename);

          stream.pipe(client.upload(options, function (err, result) {
            if (err) console.error(err);

            if (result === true) {
              logger.info('Uploaded '+ filename);
            } else {
              logger.error('Couldnt upload file ' + filename);
            }

            if (callback) {
              callback(err, filename);
            }
          }));
        }

      });

    });

  }

  return this;
}