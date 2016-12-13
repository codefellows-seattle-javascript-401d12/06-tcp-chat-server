'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client-constructor.js');
const PORT = process.env.PORT || 8080;
const server = net.createServer();
const ee = new EE();

const connectedClients = [];

server.on('connection', function(socket) {
  const client = new Client(socket);
  connectedClients.push(client);

  socket.on('close', function(user) {
    connectedClients.forEach(function(client, index) {
      if (client.id === user.id) {
        connectedClients.splice(index, 1);
        client.socket.write('Disconnecting from server.');
        client.socket.destroy();
      }
    });
  });

  socket.on('error', function(err) {
    console.log(err);
  });
});

server.listen(PORT, function() {
  console.log(`Server started on port ${PORT}.`);
});
