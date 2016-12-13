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

  console.log('this is a DM, nickname is: ', nickname);
  console.log('this is a DM, message is: ', message);

  pool.forEach(c => {
    if(c.nickname === nickname) {
      c.socket.write(`${client.nickname}: ${message}`);
    }
  });
});

ee.on('@all', function(client,string) {
  pool.forEach (c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});

// TODO nickname
ee.on('@nickname', function(client, newNickname) {
  // slice string to get new nickname
  // add that nickname to their index # in the client pool array
});

// TODO socket.destroy
ee.on('@destroy', function() {
  // this will automatically throw an error
  // do we need to do anything more here?
});

ee.on('default', function(client, string) {
  client.socket.write('not a command\n');
});

server.on('connection', function(socket) {
  var client = new Client(socket);
  pool.push(client);

  console.log('New client joined, client is: ', client.id);

  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();

    if(command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });

  // TODO socket error
  socket.on('error', function(err) {
    // log the error to the server
    // send to the terminal window acting as the server
    // NOTE add @ command to trigger socket.destroy to throw an error
  });

  // TODO socket close
  socket.on('close', function(closed) {
    // remove the user nickname from the pool
    // will I have access to the pool[i] number for that?
    // let's find out
  });

});

server.listen(PORT, function() {
  console.log(`server up: ${PORT}`);
});
