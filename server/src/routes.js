var app = require('./app');
var urlController = require('./controllers/url_controller');

module.exports = (function() {
  app.get('/urls', urlController.get);
  app.post('/urls', urlController.post);
  app.put('/urls/:id', urlController.put);
}());
