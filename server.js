'use strict';

const koa = require('koa'),
      Router = require('koa-router'),
      views = require('co-views'),
      serve = require('koa-static'),
      app = koa(),
      session = require('koa-generic-session'),
      passport = require('koa-passport');

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
 * Routes
 */
app.use(serve(__dirname));

pub.get('/', index);
pub.get('/auth/google', passport.authenticate('google'));
pub.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/admin',
    failureRedirect: '/loginFailed'
  })
)

app.use(pub.middleware())

// Require authentication
app.use(function*(next) {
  if (this.isAuthenticated()) {
    yield next
  } else {
    this.redirect('/')
  }
})

var secured = new Router()

secured.get('/admin', function*(a) {
  // console.log(JSON.stringify(this.req.user, null, 4));
  this.body = yield render('index', { user: this.req.user });
})

app.use(secured.middleware())

function *index() {
  this.body = yield render('index', {user: null});
}


app.listen(3000);



