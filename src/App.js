/*jslint unparam: true, nomen: true*/

var path = require('path');

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var App = function () {
    'use strict';
    var app = express();
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(express.static(__dirname + '/public'));
    app.use(logger('dev'));
    return app;
};

module.exports = new App();
