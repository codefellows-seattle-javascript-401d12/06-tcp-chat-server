'use strict';

const uuid = require('node-uuid');

const Client = module.exports = function(socket) {
  this.socket = socket;
  this.nickname = `newuser_${Math.random()}`;
  this.id = uuid.v4(); //gives unique id for Client
};
