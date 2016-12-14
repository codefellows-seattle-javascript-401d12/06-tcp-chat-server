'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/chat-client.js');
const PORT = process.env.PORT || 8000;
const server = net.createServer();
const ee = new EE();

const chatters = [];

ee.on('@dm', function(client, input) {
  console.log('@dm logged');
  let handle = input.split(' ').shift().trim();
  let directMessage = input.split(' ').slice(1).join(' ').trim();

  console.log('handle:', handle);
  console.log('message:', directMessage);

  chatters.forEach( chatter => {
    if (chatter.handle === handle) {
      console.log('data written');
      chatter.socket.write(`${client.handle}: ${directMessage}`);
    }
  });
});

ee.on('default', function(client, input) {
  client.socket.write('keine Befehl gegeben\n');
});

server.on('connection', function(socket) {
  var chatClient = new Client(socket);

  socket.on('data', function(data) {
    const befehl = data.toString().split(' ').shift().trim();

    console.log(befehl);

    if (befehl.startsWith('@')) {
      ee.emit(befehl, chatClient, data.toString().split(' ').slice(1).join(' '));
      console.log('ee emitted');
      return;
    }
    ee.emit('default', chatClient, data.toString());
  });
});

server.listen(PORT, function() {
  console.log(`Server running on port ${PORT}.`);
});
