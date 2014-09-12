var templates = {

  _loaded : {
  },

  load : function(name, callback) {
    var self = this;

    $.get('/views/templates/' + name + '.html', function(data) {
        self._loaded[name] = data;

        if (callback) {
          callback(data);
        }
    });
  }
};

var LoginModel = Backbone.Model.extend({
 urlRoot: '/api/home'
})

var LoginView = Backbone.View.extend({

 el: '#login',

 events: {
   'click button': 'handleLoginClick'
 },

 initialize: function() {
   this.model = new LoginModel();
 },

 render: function() {
  var self = this;

  var button = {
    title: 'Login'
  }

  templates.load('login', function (loadedTemplate) {
    var compiledTemplate = Handlebars.compile(loadedTemplate);
    var populatedTemplate = compiledTemplate(button);

    self.$el.html(populatedTemplate);
  });
 },

 handleLoginClick: function(e){

 }
});

var loginView = new LoginView();
loginView.render();


