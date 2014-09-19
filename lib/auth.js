var passport = require('koa-passport'),
  config = require('../config/config.js')();

var user = {}

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(id, done) {
  done(null, user)
})

var GoogleStrategy = require('passport-google').Strategy
passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback',
    realm: 'http://localhost:' + (process.env.PORT || 3000)
  },
   function(identifier, profile, done) {
    var email = '';

    if (profile.emails && profile.emails.length > 0) {
      email = profile.emails[0].value;
      user.email = email;
    }

    user.identifier = identifier;
    user.profile = profile;

    if (email.indexOf(config.auth.allowedDomain) <= 0) {
      console.log('This email domain is not allowed: ' + email)
      user = null;
    }

    done(null, user)
  }
))