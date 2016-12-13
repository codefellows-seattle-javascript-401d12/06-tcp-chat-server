'use strict';

const uuid = require('node-uuid');

const Client = module.exports = function(socket) {
  this.socket = socket;
  this.nickname = `user_${Math.round(10000*Math.random())}`;
  this.id = uuid.v4();
};

//Methods for Client.prototype?
