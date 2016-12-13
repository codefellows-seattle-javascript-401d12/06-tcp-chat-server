'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const pool = [];

server.listen(PORT, function(){
  console.log(`Served Up: ${PORT}`);
});

server.on('connection', function(socket){
  var client = new Client(socket);
  pool.push(client);
  console.log('successfully connected');

  socket.on('data', function(data){
    const command = data.toString().split(' ').shift().trim();

    if(command.startsWith('@')){
      ee.emit(command,client,data.toString().split(' ').slice().join(' '));
      return;
    }

    ee.emit('default',client, data.toString());
  });

  socket.on('error', function(err){
    if(err) throw err;

  });

  socket.on('close', function(close){
    if(close) server.close();
    console.log('Connection Closed');
  });
});

ee.on('@dm', function(client, string){
  let nickname = client.nickname;
  let message = string.split(' ').slice(1).join(' ').trim();

  console.log(`${client.nickname}: ${message}`);

  pool.forEach(c => {
    if(c.nickname === nickname){
    c.socket.write(`${client.nickname}: ${message}`);
    }
  });
});

ee.on('@all', function(client,string){
  pool.forEach(c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});

ee.on('@nickname', function(client,string){
  var ogNickname = client.nickname;
  client.nickname = string.split(' ').slice(1).join(' ').trim();
  console.log(`${ogNickname} changed nickname to ${client.nickname}`);
});

ee.on('Default', function(client, string){
  client.socket.write('not a command\n');
});
