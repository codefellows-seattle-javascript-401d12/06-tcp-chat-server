'use strict';

const net = require('net');
const EE  = require('events');

// const uuid = require('node-uuid');

const Client = require('./model/client.js');
const PORT = process.env.PORT || 5555;

const server = net.createServer();
const ee = new EE();

const pool = [];

server.on('connection', function(socket) {
  var client = new Client(socket);
  console.log('connection:', client.nickname, client.id);

  pool.push(client);

  socket.on('data', function(data) {
    //TODO: Check for junk data

    let words = data.toString().trim().split(' ');
    const command = words[0].trim();
    if(command.startsWith('@')) {
      return ee.emit(command, client, words.slice(1).join(' ').trim());
    }
    ee.emit('@all', client, data.toString());
  });

  socket.on('error', function(err, data) {
    //TODO: What should we do on an error?
  });
});

// ee.on('default', function(client, string) {
//   //Send the message to everyone
// });

ee.on('@all', function(client, string) {
  pool.forEach( c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});

ee.on('@quit', handleQuit);
ee.on('@exit', handleQuit);

function handleQuit(client) {
  //TODO: Disconnect the client and remove from the pool.
}

ee.on('@nick', function(client, string) {
  let words = string.trim().split(' ');
  client.nickname = words.shift().trim();
  //TODO: Notify pool that client changed nickname
});

ee.on('@dm', function(client, string) {
  let words = string.trim().split(' ');
  let nickname = words.shift().trim();
  let message = words.join(' ').trim();

  pool.forEach( c => {
    if(c.nickname === nickname) {
      c.socket.write(`${client.nickname}: ${message}`);
    }
  });
});

// server.on('close', function(data) {
//
// });

server.listen(PORT, function() {
  console.log(`server up: ${PORT}`);
});
