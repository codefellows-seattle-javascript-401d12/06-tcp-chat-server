'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const pool = [];

ee.on('@dm', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  let message = string.split(' ').slice(1).join(' ').trim();

  // console.log('nickname:', nickname);
  // console.log('message:', message);

  //c = client
  pool.forEach( c => {
    if (c.nickname === nickname) {
      c.socket.write(`${client.nickname}: ${message}`);
    }
  });
});

//send a message to all
ee.on('@all', function(client, string) {
  pool.forEach( c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});

//client can change their nickname, new nickname will broadcast to all
ee.on('@nickname', function(client, string) {
  client.nickname = string.trim();
  client.socket.write(`${string} is your new nickname`);
});

//display if @ is not used when writing a message
ee.on('default', function(client, string) {
  client.socket.write('not a command\n');
});

server.on('connection', function(socket) {
  var client = new Client(socket);
  pool.push(client);

  console.log('we have connected successfully');
  console.log('client:', client.id);

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

  //this will show that client is disconnected when closed
  socket.on('close', function() {
    pool.forEach(function(client) {
      client.socket.write(`${client.nickname} is disconnected`);
    });
  });
});

server.listen(PORT, function() {
  console.log(`server up: ${PORT}`);
});
