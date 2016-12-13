'use strict';

const EE = require('events');
const net = require('net');
const ee = new EE();
const Client = require('./model/client.js');
const PORT = process.env.PORT || 8080;
const server = net.createServer();
const clients = [];
const activeUsers = [];

server.listen(PORT, () => {
  console.log(`Client connected on port ${PORT}`);
});

ee.on('@all', function(client, string) {
  clients.forEach( users => {
    users.socket.write(`${client.nickname}: ${string}`);
  });
});

ee.on('@dm', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  let message = string.split(' ').slice(1).join(' ').trim();

  clients.forEach( client => {
    if(client.nickname === nickname) {
      client.socket.write(`${client.nickname}: ${message}`);
    }
  });
});

ee.on('@nickname', function(client, string) {
  client.nickname = string.trim();
  client.socket.write(`Your new nickname is ${client.nickname}\r\n`);
});

ee.on('userConnection', () => {
  server.getConnections(function(err, count) {
    if(err) throw err;
    console.log(`Number of users online ${count}`);
  });
});

ee.on('@causeerror', function(client) {
  client.socket.destroy('destoryed socket error');
});

server.on('connection', (socket) => {
  let client = new Client(socket);
  clients.push(client);
  activeUsers.push(client.uuidv4);
  ee.emit('userConnection');

  socket.on('data', function(data) {
    const command = data.toString('utf8').split(' ').shift().trim();
    if(command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
  });

  socket.on('error', err => {
    ee.emit('userConnection');
    throw err;
  });

  socket.on('close', function() {
    let user = activeUsers.indexOf(client.uuidv4);
    if(user !== -1) clients.splice(user, 1);
    if(user !== -1) activeUsers.splice(user, 1);
    ee.emit('userConnection');
  });
});
