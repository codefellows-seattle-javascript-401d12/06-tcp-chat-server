'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client-constructor.js');
const PORT = process.env.PORT || 8080;
const server = net.createServer();
const ee = new EE();

const connectedClients = [];

ee.on('@all', function(user, data) {
  connectedClients.forEach(function(client) {
    client.socket.write(`${user.nickname}: ${data}\r\n`);
  });
});

ee.on('@nickname', function(user, data) {
  user.nickname = data.trim();
  user.socket.write(`Changed nickname to ${data}\r\n`);
});

ee.on('@pm', function(user, data) {
  var message = data.split(' ').slice(1).join(' ').trim();
  var targetUser = data.split(' ').shift().trim();

  connectedClients.forEach(function(client) {
    if (client.nickname === targetUser || client.id === targetUser) {
      user.socket.write(`To ${client.nickname}: ${message}\r\r\n\n`);
      client.socket.write(`${user.nickname} says privately: ${message}\r\r\n\n`);
    }
  });
});

ee.on('@list', function(user) {
  var placeHolder;
  user.socket.write('Users currently connected:\r\n');
  connectedClients.forEach(function(client) {
    if (client.nickname === user.nickname) {
      placeHolder = user.nickname;
      user.nickname += ' (you)';
    }
    user.socket.write(`${client.nickname}\r\n`);
  });
  user.nickname = placeHolder;
});

ee.on('@help', function(user) {
  user.socket.write('List of commands:\r\n' +
    '@all: Sends a message to all connected users.\r\n' +
    '@nickname: Change your nickname.\r\n' +
    '@pm <user>: Send a private message to a user.\r\n' +
    '@list: List of all currently connected users.\r\n' +
    '@exit: Disconnect from the server.\r\r\n\n');
});

ee.on('@exit', function(user) {
  connectedClients.forEach(function(client, index) {
    if (client.id === user.id) connectedClients.splice(index, 1);
  });
  user.socket.end();
});

ee.on('default', function(client) {
  client.socket.write('You must use a correct @ command. Use @help to see a list of commands.\r\r\n\n');
});

server.on('connection', function(socket) {
  const client = new Client(socket);
  connectedClients.push(client);

  connectedClients.forEach(function(user) {
    user.socket.write(`New user connected with nickname ${user.nickname}.\r\r\n\n`);
  });

  client.socket.write(`\r\nConnected as ${client.nickname}. Use @help for a list of commands.\r\r\n\n`);

  console.log(`New user connected: ${client.id}\r\r\n\n`);

  socket.on('error', function(err) {
    console.log(err);
  });

  socket.on('close', function() {
    connectedClients.forEach(function(user) {
      user.socket.write(`${client.nickname} disconnected.\r\r\n\n`);
    });
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
