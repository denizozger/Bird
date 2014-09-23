'use strict';

const
  koa = require('koa'),
  app = koa(),
  Router = require('koa-router'),
  views = require('co-views'),
  serve = require('koa-static'),
  session = require('koa-generic-session'),
  passport = require('koa-passport'),
  parse = require('co-busboy'),
  fs = require('fs'),
  os = require('os'),
  websocketServer = require('http').Server(app.callback()),
  io = require('socket.io')(websocketServer);

const
  config = require('./config/config.js')(),
  cdn = require('./lib/cdn.js')(config),
  _ftp = require('./lib/ftp.js')(config),
  logger = require('./lib/log');

const
  Promise = require('bluebird'),
  ftp = Promise.promisifyAll(_ftp);

var render = views(__dirname + '/views', { ext: 'ejs' });
var pub = new Router();

/**
 * Middleware
 */

// error propogator
 app.use(function *(next){
   try {
     yield next;
   } catch (err) {
     this.status = err.status || 500;
     this.type = 'html';
     this.body = '<p>Something went wrong.</p>';

     // delegate error to the regular app
     this.app.emit('error', err, this);
   }
 });

 // error handler
 app.on('error', function(err){
   logger.error('Server error: ' + err.message);
   logger.error(err);
 });

// x-response-time
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});

// sessions
app.keys = ['your-session-secret'];
app.use(session());

// authentication
require('./lib/auth');
app.use(passport.initialize());
app.use(passport.session());

// logger
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;

  if (this.response.status !== 200) {
    logger.warn(this.method + ' ' + this.response.status + ' ' + this.url + ' - ' + ms + ' ms');
  } else {
    logger.trace(this.method + ' ' + this.response.status + ' ' + this.url + ' - ' + ms + ' ms');
  }
});

var websocketConnections = {}; // user identifier -> connection

/**
 * WebSocket server
 */
 io.on('connection', function(connection){
  connection.on('upload_page', function (identifier) {
    logger.debug('New websocket connection: ' + identifier + ' on upload_page');
    websocketConnections[identifier] = connection;
  });
});

 websocketServer.listen(4000);

/**
 * Public routes
 */
app.use(serve(__dirname));

pub.get('/login', login);
pub.get('/auth/google', passport.authenticate('google'));
pub.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/admin',
    failureRedirect: '/loginFailed'
  })
)
pub.get('/logout', function*(next) {
  this.logout()
  this.redirect('/')
})

app.use(pub.middleware());

function *login() {
  this.body = yield render('login');
}

/**
 * Secure routes
 */
// Require authentication
app.use(function*(next) {
  if (this.isAuthenticated()) {
    yield next
  } else {
    this.redirect('/login')
  }
})

var secured = new Router();

secured.get('/', function*(a) {
  this.body = yield render('login');
})

secured.get('/admin', function*(a) {
  this.body = yield render('admin', { user: this.req.user });
})

secured.get('/upload', function*(a) {
  this.body = yield render('upload', { user: this.req.user });
})

secured.post('/upload', function*(a) {
  var parts = parse(this);
  var part;
  var filename;

  while (part = yield parts) {
    // var stream = fs.createWriteStream(os.tmpdir() + part.filename);
    // logger.debug('Saved file ' + part.filename + ' -> ' + stream.path);
    filename = part.filename;

    yield ftp.uploadAsync(part, part.filename);

    var userId = this.req.user.email;
    websocketConnections[userId].emit('progress', 'Uploaded ' + filename);
  }

  this.body = yield render('upload', {
      user: this.req.user,
      outcome: 'All files uploaded' }
  );
})

function *index() {
  this.body = yield render('index');
}

app.use(secured.middleware())

app.listen(3000);































