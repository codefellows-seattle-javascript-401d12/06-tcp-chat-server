'use strict';

const uuid = require('node-uuid');

const Client = module.exports = function(socket) {
  this.socket = socket;
  this.nickname = `user_${Math.round(10000*Math.random())}`;
  this.id = uuid.v4();
};

//Methods for Client.prototype?
// Client.prototype.send(msg) {
//   //TODO: Try to send the msg, if fail, then what?
//   //TODO: return SUCCESS | FAIL -> Error('something bad happened')
// }
