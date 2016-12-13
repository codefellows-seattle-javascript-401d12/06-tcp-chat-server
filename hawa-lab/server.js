'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
// giving us access to the net module which allows use to use sockets (which contains a bunch of different methods)
const server = net.createServer();
const ee = new EE();
//collecting client pool
const pool = [];

// creating a custom event.
ee.on('@dm', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  let message = string.split(' ').slice(1).join(' ').trim();

  console.log('nickname:', nickname);
  console.log('message:', message);

  pool.forEach( c => {
    if (c.nickname === nickname) {
      c.socket.write(`${client.nickname}: ${message}:`);
    }
  });
});

//@nickname should allow a user change their nickname
//change previous name in array?
ee.on('@nickname', function(client, data) {
  client.nickname = data.trim();
  client.socket.write(`The clients nickname is now ${client.nickname}\n`);
});

ee.on('@all', function(client, string) {
  pool.forEach( c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});

ee.on('default', function(client) {
  // \n = new line
  client.socket.write('not a command\n');
});

server.on('connection', function(socket) {
  // once connected it creates a new client and takes in the socket.
  var client = new Client(socket);
  // pushing new clients into empty pool array
  pool.push(client);
  console.log('client', client.userID);

  socket.on('error', (err) => {
    console.log('You have an error.\n');
  });

  // When a socket emits the close event, the socket should be removed from the client pool
  socket.on('close', function() {
    pool.forEach(function(currentClient) {
      if (client.userID === currentClient.userID) {
        pool.splice(pool.indexOf(client), 1);
      } else {
        currentClient.socket.write(`${client.nickname} is disconnected from server.\n`);
      }
    });
  });

  socket.on('data', function(data) {
    // data initially comes as a buffer, but we will convert into readable data.
    // trim: removes the whitespace from both sides.
    const command = data.toString().split(' ').shift().trim();

    if (command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    ee.emit('default', client, data.toString());
  });
});

server.listen(PORT, function() {
  console.log(`Server up on: ${PORT}`);
});
