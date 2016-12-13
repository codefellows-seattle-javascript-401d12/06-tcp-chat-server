'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const pool = [];

server.on('connection', function(socket) {
  var client = new Client(socket);
  console.log('we have connected successfully'); 
});

server.listen(PORT, function() {
  console.log(`server up: ${PORT}`);
});
