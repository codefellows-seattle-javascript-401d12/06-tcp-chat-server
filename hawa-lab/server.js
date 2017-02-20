'use strict';

// accesses the tcp protocol to connect with the server.
const net = require('net');
// event emitter
const EE = require('events');
// importing the Client constructor
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
// giving us access to the net module which allows use to use sockets (which contains a bunch of different methods)
const server = net.createServer();
// making an event emitter object
const ee = new EE();
//collecting client pool
const pool = [];

// creating a custom event that gives us access to the newly made client, and the string(message they wrote)
ee.on('@dm', function(client, string) {
  // 
  let nickname = string.split(' ').shift().trim();
  let message = string.split(' ').slice(1).join(' ').trim();

  console.log('nickname:', nickname);
  console.log('message:', message);

  pool.forEach( c => {
    //c is a client
    if (c.nickname === nickname) {
      // gets client nickname and message
      c.socket.write(`${client.nickname}: ${message}`);
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
    //writes back the client and the message.
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

  // there's a network socket that emits some sort of data
  socket.on('data', function(data) {
    // data initially comes as a buffer, but we will convert into readable data.
    // trim: removes the whitespace from both sides.
    const command = data.toString().split(' ').shift().trim();
    
    // remove carriage return - returns the cursor to the beginning of the same line
    // remove new line character - puts you on a new line
    // shift() returns the first item of an array and returns that
    // trim() removes whitespace from left and right side

    if (command.startsWith('@')) {
      // split makes it into an array and join turns it back to a string.
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    ee.emit('default', client, data.toString());
  });
});

ee.on('@exit', function(user) {
  pool.forEach(function(client, index) {
    if (client.id === user.id) pool.splice(index, 1);
  });
  user.socket.end();
});

//server is listening for a PORT to run on
server.listen(PORT, function() {
  console.log(`Server up on: ${PORT}`);
});
