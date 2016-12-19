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
  let directMessage = input.split(' ').slice(1).join(' ');

  chatters.forEach( chatter => {
    if (chatter.handle === handle) {
      chatter.socket.write(`${client.handle}: ${directMessage}`);
    };
  });
});

ee.on('@handle', function(client, input) {
  console.log('handle setting request logged');
  client.handle = input.toString().split(' ').shift().trim();
});

ee.on('@all', function(client, input) {
  console.log('broadcast message sent');
  chatters.forEach( chatter => {
    // broadcast message to all users EXCEPT for sender
    if (chatter.handle != client.handle) {
      chatter.socket.write(`${client.handle}: ${input}`);
    };
  });
});

ee.on('default', function(client, input) {
  // German for "no command given"
  client.socket.write('keinen Befehl gegeben\n');
});

ee.on('close', function(client) {
  chatters.forEach( chatter => {
    if (chatter.handle) {
      chatter.socket.write(`${client.handle} has left the chat\n`);
    };
  });
});

server.on('connection', function(socket) {
  var chatClient = new Client(socket);
  chatters.push(chatClient);

  socket.on('data', function(data) {
    // Befehl is German for "Command"
    const befehl = data.toString().split(' ').shift().trim();

    if (befehl.startsWith('@')) {
      ee.emit(befehl, chatClient, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    ee.emit('default', chatClient, data.toString());
  });
  socket.on('end', function() {
    chatters.splice(chatters.indexOf(chatClient), 1);
    ee.emit('close', chatClient);
  });
});

server.listen(PORT, function() {
  console.log(`Server running on port ${PORT}.`);
});
