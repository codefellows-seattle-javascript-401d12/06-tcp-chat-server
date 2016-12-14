'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT =  3000;
const server = net.createServer();
const ee = new EE();


const currentUsers = [];

// @dm --------------------------------------------
ee.on('@dm', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  let message = string.split(' ').slice(1).join(' ').trim();

  console.log('nickname:', nickname);
  console.log('message:', message);

  currentUsers.forEach( c => {
    if(c.nickname === nickname) {
      c.socket.write(`${client.nickname}: ${message}`);
    }
  });
});

// @all -------------------------------------------
ee.on('@all', function(client, string) {
  currentUsers.forEach( c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});

// @nickname --------------------------------------
ee.on('@nickname', function(client, string) {
  client.nickname = string.trim();

  client.socket.write(`${client.nickname} is your new nickname`);
});

// @exit ------------------------------------------
ee.on('@exit', function(client) {
  currentUsers.forEach( c => {
    c.socket.write(`${client.nickname} has left the room`);
  });
  client.socket.end();
  if(currentUsers.length === 1) {
    currentUsers.forEach( c => {
      c.socket.write('Looks like everyone left but you.');
    })
  }
});

// @commands --------------------------------------
ee.on('@commands', function(client) {
  client.socket.write(
    'These are the available commands\n' +
    'To change your nickname:\n' +
    '@nickname newNickname\n' +
    'To message everyone:\n' +
    '@all your message\n' +
    'To message a specific user:\n' +
    '@dm nickname your message\n' +
    'To exit the chat:\n' +
    '@exit\n' +
    'To see this list of commands:\n' +
    '@commands'
  );
});

// @default ---------------------------------------
ee.on('default', function(client, string) {
  client.socket.write(
    'not a command\n' +
    'These are the available commands\n' +
    'To change your nickname:\n' +
    '@nickname newNickname\n' +
    'To message everyone:\n' +
    '@all your message\n' +
    'To message a specific user:\n' +
    '@dm nickname your message\n' +
    'To exit the chat:\n' +
    '@exit\n' +
    'To see this list of commands:\n' +
    '@commands'
  );
});

// Server on connection ---------------------------
server.on('connection', function(socket) {
  var client = new Client(socket);
  currentUsers.push(client);

  console.log('Chat is running');

  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();

    if(command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    };
    ee.emit('default', client, data.toString());
  });
});

// Server on listen --------------------------
server.listen(PORT, function() {
  console.log(`Server running on: ${PORT}`);
});
