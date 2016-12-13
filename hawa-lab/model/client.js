'use strict';

const uuid = require('node-uuid');


const Client = module.exports = function(socket) {
  this.socket = socket;
  this.nickname = `user_${Math.random()}`;
  // v4 generates a longer string than v1..
  this.userID = uuid.v4();
};
