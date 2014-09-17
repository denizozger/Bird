const
  JSFtp = require('jsftp');


module.exports = function(config) {

  this.upload = function(file, filename, callback) {

    var ftpClient = new JSFtp(config.ftp);

    console.log('Uploading %s -> %s', filename, config.ftp.directory );

    ftpClient.on('jsftp_debug', function(eventType, data) {
      console.log('DEBUG: ', eventType);
      console.log(JSON.stringify(data, null, 2));
    });

    ftpClient.put(file, config.ftp.directory + filename, function(err) {
      if (!err) {

        console.log(filename + ' transferred successfully to ' + config.ftp.directory );

        // ftpClient.raw.chmod('664', 'test.jpg', function(err, data) {
        //     if (err) return console.error(err);
        //     console.log(data.text); // Show the FTP response text to the user
        //     console.log(data.code); // Show the FTP response code to the user
        // });
      }
    });


  }

  return this;
}