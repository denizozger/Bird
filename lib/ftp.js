const
  Client = require('ftp');


module.exports = function(config) {

  this.upload = function(file, filename, callback) {

    var client = new Client();

    client.on('ready', function() {

      client.put(file, config.ftp.directory + filename, function(err) {
        if (err) return console.error(err);

        console.log('Uploaded ' + filename + ' to ' + config.ftp.directory);

        var chmodCommand = 'chmod ' + config.ftp.filePermission + ' ' + config.ftp.directory + filename;

        client.site(chmodCommand, function(err, responseText, responseCode) {
          if (err) return console.error(err);

          if (responseCode === 200) {
            console.log('Set permissions of ' + filename + ' successfully' );
          } else {
            console.error(responseText);
          }
        })

        client.end();
      });
    });

    client.connect(config.ftp);

  }

  return this;
}