Bird
===

Delete-key friendly, modern Hackathon starter

Currently, it uses
- [Koa] as web server
- [EJS] for templating
- [Passport] for authentication
- [Bower] for front-end packages
- [Backbone] except routing
- [Sass] for tidy CSS
- [HTML5 Boilerplate] as front-end template

Issues
- On Heroku Bower components are secured, on local they are public (gah)
- On Heroku, Google auth error: "OpenID auth request contains an unregistered domain"

The future
- [Moongoose] as DB
- [Handlebars] for templating (it is actually there & works but isn't in use yet)
- [Require.js] for front-end dependencies
- [Grunt] for minification
- Deploy to Heroku button
- Form validation
- MVC pattern
- Testing with [Mocha]

## Running locally
```
npm install
bower install
node --harmony server
```
If you want to change CSS for development, run below command as well on a seperate terminal
```
sass --watch sass:css
```
[Koa]:http://koajs.com/
[EJS]:http://embeddedjs.com/
[Passport]:http://passportjs.org/
[Bower]:http://bower.io/
[Moongoose]:https://github.com/learnboost/mongoose
[Mocha]:https://github.com/mochajs/mocha
[Backbone]:http://backbonejs.org/
[Handlebars]:http://handlebarsjs.com/
[HTML5 Boilerplate]:http://html5boilerplate.com/
[Require.js]:http://requirejs.org/
[Grunt]:http://gruntjs.com/
[Sass]:http://sass-lang.com/
