Bird
===

This is some sort of playground that I try frameworks/technologies

Currently, it uses
- [Koa] as web server
- [EJS] for templating
- [Passport] for authentication
- [Bower] for front-end packages
- [Backbone] except routing
- [Sass] for tidy CSS

The future
- [Handlebars] for templating (it is actually there & works but isn't in use yet)
- [Require.js] for front-end dependencies
- [Grunt] for minification
- Deploy to Heroku button
- Form validation
- MVC pattern
- Try out https://github.com/gmetais/grunt-devperf

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
[Backbone]:http://backbonejs.org/
[Handlebars]:http://handlebarsjs.com/
[Require.js]:http://requirejs.org/
[Grunt]:http://gruntjs.com/
[Sass]:http://sass-lang.com/
