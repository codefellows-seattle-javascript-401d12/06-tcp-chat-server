'use strict';

const EE = require('events');
const net = require('net');
const ee = new EE();
const Client = require('./model/client.js');
const PORT = process.env.PORT || 8080;
const server = net.createServer();

server.listen(PORT, () => {
  console.log(`Client connected on port ${PORT}`);
});

server.on('error', err => {
  throw err;
});
