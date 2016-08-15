const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const routes = require('./app/index');

var config = require('./appconfig');
var logger = require('./applogger');

const mongoose = require('mongoose');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

var dbURI = 'mongodb://localhost/' + config.appdb;
mongoose.connect(dbURI);
mongoose.connection.on('connected', function() {
  logger.debug('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
  logger.debug('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
  logger.debug('Mongoose disconnected');
});

process.on('exit', function(err) {
  mongoose.connection.close(function() {
    logger.debug('Mongoose disconnected through app termination');
  });
});


app.use('/', routes);

app.use(function(req, res, next) {
  var err = new Error('Resource not found');
  err.status = 404;
  return res.status(err.status).json({
    "error": err.message
  });
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    logger.error("Internal error encountered: ", err);
    return res.status(err.status || 500).json({
      "error": err
    });
  });
}

app.use(function(err, req, res, next) {
  logger.error("Internal error encountered: ", err);
  return res.status(err.status || 500).json({
    "error": err.message
  });
});

app.onAppStart = function(addr) {
  logger.info(config['appname'] + ' is now running on port:', addr.port);
}

module.exports = app;