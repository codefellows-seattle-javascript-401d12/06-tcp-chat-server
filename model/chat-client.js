'use strict';

const uuid = require('node-uuid');

const Client = module.exports = function(socket) {
  this.socket = socket;
  this.handle = `user_${Math.random()}`;
  this.id = uuid.v4();
};
