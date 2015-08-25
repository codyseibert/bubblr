var Promise = require('bluebird');
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

  destroy = function (req, res) {
    var id = req.params.id;
    url.findById(id).then(function(obj) {
      return obj.destroy();
    }).then(function() {
      return url.findAll({where: {target: id}});
    }).then(function(urls) {
      return Promise.all(urls.map(function(u) {
        u.target = -1
        return u.save();
      }));
    }).then(function() {
      res.status(200);
      res.send('deleted')
    });
  };

  return {
    get: get,
    put: put,
    post: post,
    destroy: destroy
  };

}());
