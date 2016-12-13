'use strict';

const uuid = require('node-uuid');

const Client = module.exports = function(socekt) {
  this.socket = socket;
  this.handle = `user_${Math.random()}`;
  this.id = uuid.v4();
};
