var url = require('../models/url');

module.exports = (function() {

  var get, post;

  get = function (req, res) {
    url.findAll().then(function(urls) {
      res.status(200);
      res.send(urls);
    });
  };

  put = function (req, res) {
    url.findById(req.params.id).then(function(obj) {
      obj.name = req.body.name;
      obj.url = req.body.url;
      obj.type = req.body.type;
      obj.target = req.body.target;
      obj.save().then(function() {
        res.status(200);
        res.send(obj);
      });
    });
  };

  post = function (req, res) {
    obj = url.create({
      name: req.body.name,
      url: req.body.url,
      type: req.body.type,
      target: req.body.target
    }).then(function(obj) {
      res.status(200);
      res.send(obj);
    });
  };

  return {
    get: get,
    put: put,
    post: post
  };

}());
