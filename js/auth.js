var passport = require('koa-passport');

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
    user.identifier = identifier;
    user.profile = profile;
    done(null, user)
  }
))