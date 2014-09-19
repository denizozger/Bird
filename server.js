'use strict';

const koa = require('koa'),
      Router = require('koa-router'),
      views = require('co-views'),
      serve = require('koa-static'),
      app = koa(),
      session = require('koa-generic-session'),
      passport = require('koa-passport'),
      parse = require('co-busboy'),
      fs = require('fs'),
      config = require('./config/config.js')(),
      cdn = require('./lib/cdn.js')(config),
      ftp = require('./lib/ftp.js')(config),
      os = require('os'),
      websocketServer = require('http').Server(app.callback()),
      io = require('socket.io')(websocketServer),
      co = require('co');

var render = views(__dirname + '/views', { ext: 'ejs' });
var pub = new Router();

/**
 * Middleware
 */

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
require('./js/auth');
app.use(passport.initialize());
app.use(passport.session());

// logger
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s %s - %s ms', this.method, this.response.status, this.url, ms);
});

var websocketConnections = {}; // identifier -> connection

/**
 * WebSocket server
 */
 io.on('connection', function(connection){
  connection.on('upload_page', function (identifier) {
    console.log('New websocket connection ' + identifier);
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
  // console.log(JSON.stringify(this.req.user, null, 4));
  this.body = yield render('admin', { user: this.req.user });
})

secured.get('/upload', function*(a) {
  this.body = yield render('upload', { user: this.req.user });
})

secured.post('/upload', function*(a) {
  // the rest of the updates will be done via websocket channel
  this.body = yield render('upload', { user: this.req.user });

  // multipart upload
  var parts = parse(this);
  var part;
  var filename;

  while (part = yield parts) {
    var stream = fs.createWriteStream(os.tmpdir() + part.filename);
    part.pipe(stream);
    filename = part.filename;

    console.log('Receiving %s -> %s', part.filename, stream.path);

    var file = fs.createReadStream(stream.path);
    var userId = this.req.user.identifier;

    ftp.upload(file, part.filename, function(filename) {
      websocketConnections[userId].emit('progress', 'Uploaded ' + filename);
    });
  }
})

function *index() {
  this.body = yield render('index');
}

app.use(secured.middleware())

app.listen(3000);































