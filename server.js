'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/chat-client.js');
const PORT = process.env.PORT || 8000;
const server = net.createServer();
const ee = new EE();

const chatters = [];

server.listen(PORT, function() {
  console.log(`Server running on port ${PORT}.`);
});
