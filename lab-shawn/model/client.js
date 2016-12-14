'use strict';

const uuid = require('node-uuid');

const Client = module.exports = function(socket){
  this.socket = socket;
  this.nickname = `user_${Math.floor(Math.random() * 1000)}`;
  this.id = uuid.v4();
}
