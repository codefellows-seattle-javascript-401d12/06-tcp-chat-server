'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const allUsers = [];

ee.on('@dm', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  let message = string.split(' ').slice(1).join(' ').trim();

  // console.log('nickname', nickname);
  // console.log('message', message); // shows message after @dm

  allUsers.forEach( c => {
    if(c.nickname === nickname) {
      c.socket.write(`${client.nickname}: ${message}\n`);
    }
  });
});

ee.on('@all', function(client, data) {
  allUsers.forEach( c => {
    c.socket.write(`${client.nickname}: ${data}`);
  });
});

ee.on('@nickname', function(client, data){
  client.nickname = data.trim();
  client.socket.write(`nickname is now: ${data}`);
});

ee.on('default', function(client) {
  client.socket.write('not a command');
});

server.on('connection', function(socket) {
  var user = new Client(socket);
  allUsers.push(user);


  // console.log(client); shows socket
  console.log('connection successful');
  console.log('client:', user.id);

  socket.on('data', function(data) { //socket accepts data when we hit enter
    const command = data.toString().split(' ').shift().trim();

    // console.log(command); //shows command from telnet server connection
    // console.log(command.split(' ')); shows phrase split by strings
    if (command.startsWith('@')) {
      ee.emit(command, user, data.toString().split(' ').slice(1).join(' '));
      return;
      // comes back as buffer, turns toString, split by 1 space, remove @ symbol, joins back full string
    }

    ee.emit('default', user, data.toString()); //if command does not have @, will hit default event 'not a command' and returns on telnet
  });

  socket.on('error', function(err) {
    console.log(err);
  });

  socket.on('close', function() {
    allUsers.forEach(function(client) {
      client.socket.write(`${user.nickname} is no longer connected.`);

    });
  });
});

server.listen(PORT, function() {
  console.log(`server live on: ${PORT}`); //connects to server through port
});
