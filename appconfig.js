/*!
 * Copyright(c) Basavaraj K N <rajiff@gmail.com>
 */
const path = require('path');
const extend = require('util')._extend;

const fs = require('fs');
const envFile = require('path').join(__dirname, 'env.json');

var env = {};
if (fs.existsSync(envFile)) {
  env = fs.readFileSync(envFile, 'utf-8');
  env = JSON.parse(env);
  Object.keys(env).forEach(key => process.env[key] = env[key]);
}

/**
 * Expose
 */
const development = {
  appname: 'Slot Booking Service',
  masterdb: 'slotorders',
  mongo: {
    host: '127.0.0.1',
    port: 27017
  }
};

const defaults = {
  root: path.join(__dirname, '..')
};

module.exports = {
  development: extend(development, defaults)
}[process.env.NODE_ENV || 'development'];