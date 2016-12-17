'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const chatUsers = [];

ee.on('@dm', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  let message = string.split(' ').slice(1).join(' ').trim();

  console.log('this is a DM, nickname is: ', nickname);
  console.log('this is a DM, message is: ', message);

  chatUsers.forEach(c => {
    if(c.nickname === nickname) {
      c.socket.write(`${client.nickname}: ${message}`);
    }
  });
});

ee.on('@all', function(client,string) {
  chatUsers.forEach (c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});

// TODO nickname
ee.on('@nickname', function(client, string) {
  let newNickname = string.split(' ').shift().trim();
  client.nickname = newNickname;
  console.log('User entered new chosen name: ', newNickname);
  console.log(`User client.nickname is: ${client.nickname}`);
  console.log('User client.id is: ', client.id);
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
  chatUsers.push(client);

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

  socket.on('close', function() {
    console.log(chatUsers.indexOf(client));
    var index = chatUsers.indexOf(client);
    chatUsers.splice(index, index +1);
    // console.log(`client nickname: ${client.nickname} has left the chat.`);
    console.log(`client id: ${client.id} has left the chat.`);
    chatUsers.forEach (c => {
      c.socket.write(`${client.nickname} has left the chat.`);
    });
  });

});

server.listen(PORT, function() {
  console.log(`server up: ${PORT}`);
});
