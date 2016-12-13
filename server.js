'use strict';

const EE = require('events');
const net = require('net');
const ee = new EE();
const Client = require('./model/client.js');
const PORT = process.env.PORT || 8080;
const server = net.createServer();
const activeUsers = [];

server.listen(PORT, () => {
  console.log(`Client connected on port ${PORT}`);
});

server.on('error', err => {
  throw err;
});

// server.close(console.log('Client has closed connection'));

ee.on('userConnection', () => {
  server.getConnections(function(err, count) {
    if(err) throw err;
    console.log(`Number of users online ${count}`);
  });
});

ee.on('@nickname', function(client, string) {
  client.nickname = string.split(' ');
  client.socket.write(`Your new nickname is ${client.nickname}`);
});

server.on('connection', (socket) => {
  let client = new Client(socket);
  activeUsers.push(client.uuidv4);
  ee.emit('userConnection');

  socket.on('data', function(data) {
    const command = data.toString('utf8').split(' ').shift().trim();
    if(command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
  });
});
