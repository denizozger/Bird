'use strict';

const koa = require('koa'),
      Router = require('koa-router'),
      views = require('co-views'),
      serve = require('koa-static'),
      app = koa(),
      session = require('koa-generic-session'),
      passport = require('koa-passport'),
      parse = require('co-busboy'),
      fs = require('fs');

var render = views(__dirname + '/views', { ext: 'ejs' });
var pub = new Router()

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
  this.body = yield render('upload');
})

secured.post('/upload', function*(a) {
  // multipart upload
  var parts = parse(this);
  var part;

  while (part = yield parts) {
    var stream = fs.createWriteStream('tmp/' + part.filename);
    part.pipe(stream);
    console.log('Uploading %s -> %s', part.filename, stream.path);
  }

  this.body = yield render('upload', { outcome: 'success'});
})

function *index() {
  this.body = yield render('index');
}

app.use(secured.middleware())

app.listen(3000);































