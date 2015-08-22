require('./routes');

require('./models/url');

require('./sequelize').sync().then(function() {
  require('./app').listen(5001);
});
