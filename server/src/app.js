var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

module.exports = (function() {
  var app = express();
  app.use(bodyParser.json());
  app.use(cors());
  return app;
}());
