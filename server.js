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

  console.log('nickname', nickname);
  console.log('message', message); // shows message after @dm

  pool.forEach( c => {
    if(c.nickname === nickname) {
      c.socket.write(`${client.nickname}: ${message}`);
    }
  });
});

ee.on('@all', function(client, message) {
  pool.forEach( c => {
    c.socket.write(`${client.nickname}: ${message}`);
  });
});

ee.on('default', function(client, string) {
  client.socket.write('not a command\n');
});

server.on('connection', function(socket) {
  var client = new Client(socket);
  pool.push(client);


  // console.log(client); shows socket
  console.log('connection successful');
  console.log('client:', client.id);

  socket.on('data', function(data) { //socket accepts data when we hit enter
    const command = data.toString().split(' ').shift().trim();

    // console.log(command); //shows command from telnet server connection
    // console.log(command.split(' ')); shows phrase split by strings
    if (command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
      // comes back as buffer, turns toString, split by 1 space, remove @ symbol, joins back full string
    }

    ee.emit('default', client, data.toString()); //if command does not have @, will hit default event 'not a command' and returns on telnet
  });
});

server.listen(PORT, function() {
  console.log(`server live on: ${PORT}`);
});
