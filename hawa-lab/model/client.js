'use strict';
//Generates a random id
const uuid = require('node-uuid');

//the socket is a data contained in one area and the communication of another socket elsewhere
const Client = module.exports = function(socket) {
  //the socket from the instance of the Client object
  this.socket = socket;
  //generates a random number for the user
  this.nickname = `user_${Math.random()}`;
  // v4 generates a longer string than v1..
  this.userID = uuid.v4();
};
