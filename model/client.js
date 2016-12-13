'use strict';
const uuid = require('node-uuid');


const Client = module.exports = function(socket) {
  this.socket = socket;
  this.nickname = `user:${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}`;
  this.id = uuid.v4();
};
