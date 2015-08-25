var Sequelize = require('sequelize');
var sequelize = require('../sequelize');

module.exports = (function() {
  return sequelize.define('url', {
    name: Sequelize.STRING,
    url: Sequelize.STRING,
    type: Sequelize.STRING,
    target: Sequelize.INTEGER
  });
}());
