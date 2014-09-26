module.exports = function() {

  this.cdn = {
    provider: process.env.CDN_PROVIDER,
    username: process.env.CDN_USERNAME,
    apiKey: process.env.CDN_API_KEY,
    region: process.env.CDN_REGIION,
    containerName: process.env.CDN_CONTAINER_NAME
  }

  this.ftp = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    directory: process.env.FTP_DIRECTORY,
    filePermission: 644
  }

  this.auth = {
    allowedDomain: 'gmail.com'
  }

  this.server = {
    port: 5000
  }

  return this;
}