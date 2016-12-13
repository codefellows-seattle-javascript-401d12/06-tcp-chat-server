'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client-constructor.js');
const PORT = process.env.PORT || 8080;
const server = net.createServer();
const ee = new EE();

const connectedClients = [];

const getMessage = function(data) {
  return data.split(' ').slice(1).join(' ').trim();
};

ee.on('@all', function(user, data) {
  var message = getMessage(data);

  connectedClients.forEach(function(client) {
    client.socket.write(`${user.nickname}: ${message}\r\n`);
  });
});

ee.on('@nickname', function(user, data) {
  var newNick = getMessage(data);
  user.nickname = newNick;
  user.socket.write(`Changed nickname to ${newNick}`);
});

ee.on('@pm', function(user, data) {
  var message = getMessage(data);
  var targetUser = data.split(' ').shift().trim();

  connectedClients.forEach(function(client) {
    if (client.nickname === targetUser || client.id === targetUser) {
      client.socket.write(`${user.nickname} says privately: ${message}\r\n`);
    }
  });
});

ee.on('@help', function(user) {
  user.socket.write('List of commands:\r\n' +
    '@all: Sends a message to all connected users.\r\n' +
    '@nickname: Change your nickname.\r\n' +
    '@pm <user>: Send a private message to a user.\r\n' +
    '@exit: Disconnect from the server.\r\n');
});

ee.on('@exit', function(user) {
  user.socket.emit('close');
});

ee.on('default', function(client) {
  client.socket.write('You must use a correct @ command. Use @help to see a list of commands.\r\n');
});

server.on('connection', function(socket) {
  const client = new Client(socket);
  connectedClients.push(client);

  console.log(`New user connected: ${client.id}\r\n`);

  socket.on('close', function(err) {
    if (err) console.log(err);
    connectedClients.forEach(function(client) {
      client.socket.write('Disconnecting from server.\r\n');
      client.socket.destroy();
    });
  });

  socket.on('error', function(err) {
    console.log(err);
  });

  socket.on('data', function(data) {
    const message = data.toString().split(' ').shift().trim();

    console.log(data);

    if (message.startsWith('@')) {
      ee.emit(message, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });
});

server.listen(PORT, function() {
  console.log(`Server started on port ${PORT}.`);
});
