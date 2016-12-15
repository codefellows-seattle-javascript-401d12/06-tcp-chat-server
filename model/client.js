'use strict';

const uuid = require('node-uuid');

var i = 0;
const Client = module.exports = function(socket){
 this.socket = socket;
 this.nickname = `user-${Math.random()}`;
 this.id = uuid.v4();
 console.log('new client added client-',i);
};
