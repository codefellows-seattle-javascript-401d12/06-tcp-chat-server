'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const chatFolks = [];

// Allow client to direct message another client.
ee.on('@dm', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  let message = string.split(' ').slice(1).join(' ').trim();
  chatFolks.forEach( client => {
    if (client.nickname === nickname) {
      client.socket.write(`${client.id} sent a message.\n`);
      client.socket.write(`${client.nickname}: ${message}\n`);
    }
  });
});

// Allow client to change their nickname.
ee.on('@nickname', function(client, string) {
  client.nickname = string.trim();
  client.socket.write(`Your awesome new user name is: ${string}`);
});

// Allow client to broadcast public message to all folks in the chat.
ee.on('@all', function(client, string) {
  chatFolks.forEach( client => {
    client.socket.write(`${client.nickname}: ${string}`);
  });
});

// Run this if an incorrect command is given.
ee.on('default', function(client, string) {
  client.socket.write(`${string} is not a valid command`);
});

// Run this logic upon connecting to the server.
server.on('connection', function(socket) {
  var client = new Client(socket);
  console.info(`${client.id} has joined the Awesome Chat Room.`);

  // Store client's info for use.
  chatFolks.push(client);

  // Welcome message.
  socket.write(`Welcome to this Awesome Chat Room, ${client.id}.\n`);
  socket.write('To direct message someone, type "@dm <your name> <your message>".\n');
  socket.write(`To change your user name to something other than ${client.id}, type "@nickname <your new user name>".\n`);
  socket.write('To broadcast a message to everyone in the chat, type "@all <message>".\n');
  socket.write('To leave the chat room, hold "ctrl + [". When the telnet prompt appears, type "quit".\n');

  // Client can implement the chat with @ plus a valid command.
  socket.on('data', ( data ) => {
    const command = data.toString().split(' ').shift().trim();
    if (command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    ee.emit('default', client, data.toString());
  });

  // Account for when a client leaves and a connection is closed.
  socket.on('close', () => {
    chatFolks.forEach( client => {
      if(client.id === client.id){
        let index = chatFolks.indexOf(client);
        chatFolks.splice(index, index + 1);
      }
      console.info(`${client.id} has left the Awesome Chat Room`);
    });
  });

  // Account for an error.
  socket.on('error', function(err){
    console.error('Ruh roh. An error occurred', err);
  });
});

// Log that the server is up when node server.js is running without errors.
server.listen(PORT, function() {
  console.info(`server up: ${PORT}`);
});
