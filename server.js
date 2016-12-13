'use strict';

const net = require('net');
const server = net.createServer();
const Client = require('./model/client.js');
const EE = require('events');
const ee = new EE();
const PORT = process.env.PORT || 8000;
const users = [];

ee.on('default', function(client, string) {
  client.socket.write('not a command\n');
});

ee.on('@dm', function(client, string) {
  let nickname = string.split(' ').shift();
  console.log(nickname);
  let message = string.split(' ').splice(1).join(' ').trim();
  users.forEach( c => {
    if (c.nickname === nickname) {
      client.socket.write(`You: ${message}\n`);
      c.socket.write(`${client.nickname}: ${message}\n`);
    }
  });
});

ee.on('@nickname', function(client, string) {
  client.nickname = string.trim();
  console.log('nickname changed:', client.nickname);
  users.forEach( c => {
    if (c.nickname === client.nickname) {
      c.socket.write(`Nickname set to ${client.nickname}\n`);
    }
  });
});

ee.on('@all', function(client, string) {
  users.forEach( c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});

ee.on('@help', function(client, string) {
  client.socket.write('Commands:\n' +
  '@nickname - set your nickname\n' +
  '@dm - send user direct message\n' +
  '@all - send all users message\n');
});

server.on('connection', function(socket) {
  var client = new Client(socket);
  users.push(client);
  console.log(`${client.nickname} connected successfully`);
  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();
    if (command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    ee.emit('default', client, data.toString());
  });
  socket.on('error', function(err) {
    console.log(err);
  });
  socket.on('close', function() {
    users.forEach( c => {
      if (client.nickname === c.nickname) {
        users.splice(users.indexOf(c, 1));
      }
      users.forEach( c => {
        c.socket.write(`${client.nickname} has left.\n`);
      });
    });
    console.log(`${client.nickname} closed connection`);
  });
});

server.listen(PORT, function() {
  console.log(`PORT:${PORT} running`);
});
