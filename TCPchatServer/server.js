'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = 3000;
const server = net.createServer();
const ee = new EE();

const pool = [];

// @dm --------------------------------------------
ee.on('@dm', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  let message = string.split(' ').slice(1).join(' ').trim();
  // 
  // console.log('nickname:', nickname);
  // console.log('message:', message);

  pool.forEach( c => {
    if(c.nickname === nickname) {
      c.socket.write(`${client.nickname}: ${message}`);
    }
  });
});
// @all -------------------------------------------
ee.on('@all', function(client, string) {
  pool.forEach( c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});
// @nickname --------------------------------------
ee.on('@nickname', function(client, string) {
  client.nickname = string.trim();

  // client.socket.write(`${client.nickname} is your new nickname`);
  // pool.forEach( c => {
  //   if(c.nickname === client.nickname) {
  //     c.socket.write(`Nickname is set to ${client.nickname}`);
  //   };
  // });
});

// @exit ------------------------------------------
ee.on('@exit', function(client) {
  pool.forEach( c => {
    c.socket.write(`${client.nickname} has left the room`);
  });
  client.socket.end();
});

// @default ---------------------------------------
ee.on('default', function(client, string) {
  client.socket.write('not a command\n');
});

// Server on connection ---------------------------
server.on('connection', function(socket) {
  var client = new Client(socket);
  pool.push(client);

  console.log('we have connected successfully');
  console.log(client.id);

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
