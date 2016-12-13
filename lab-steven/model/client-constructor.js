'use strict';

const uuid = require('node-uuid');

const Client = module.exports = function(socket) { //eslint-disable-line
  this.socket = socket;
  this.id = uuid.v4();
  this.nickname = `Weasel${Math.floor(Math.random() * 9286)}`;
};
