'use strict';

const EE = require('events');
const ee = new EE();
const server = require('net').createServer();
const Client = require('./client.js');
const PORT = process.env.PORT || 2001;

const clientPool = [];

////////////////////////////////////////////////////commands

ee.on('@all', function(client, data) {
  var message = data.toString().split(' ').slice(1).join(' ').trim();
  clientPool.forEach(destClient => {
    destClient.socket.write(`${client.nickname}: ${message}\n`);
  });
});

ee.on('@dm', function (client, data) {
  let identifier = data.toString().split(' ')[1].trim();
  let message = data.toString().split(' ').slice(2).join(' ').trim();
  clientPool.forEach(destClient => {
    if (destClient.nickname === identifier || destClient.id === identifier) destClient.socket.write(`${client.nickname} (whisper): ${message}\n`);
  });
});

ee.on('@nick', function(client, data) {
  var newNick = data.toString().split(' ')[1].trim();
  for (var i in clientPool) clientPool[i].socket.write(`${client.nickname} is now known as ${newNick}\n`);
  client.nickname = newNick;
});

ee.on('@exit', function(client) {
  client.socket.end('Bye now!\n');
});

ee.on('default', function (client, data) {
  var garbage = data.toString().trim();
  client.socket.write(`${garbage} is not a command!\n`);
});

////////////////////////////////////////////////////server and socket events

server.on('connection', function(socket) {
  var client = new Client(socket);
  clientPool.push(client);
  console.log(`Client connected: ${client.id}`);

  socket.on('data', function(data) {
    console.log(`${client.id} sent: ${data}`);
    var dataWords = data.toString().split(' ');
    var command = dataWords.shift().trim();
    if (data.toString().startsWith('@')) ee.emit(command, client, data);
    else (ee.emit('default', client, data)); //I know Brian doesn't like 'else' - tell me why this isn't more concise than using a break!
  });

  socket.on('close', function() {
    console.log(`Client closed socket: ${client.id}`);
    clientPool.splice(clientPool.indexOf(client), 1);
  });

  socket.on('error', function(err) {
    console.log('socket error: ', err);
  });
});

server.listen(PORT, function() {
  console.log(`server is listening on port ${PORT}`);
});
