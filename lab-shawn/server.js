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

  pool.forEach(c => {
    c.socket.write(`${client.nickname} has entered the building\n`);
  });


  socket.on('data', function(data){
    const command = data.toString().split(' ').shift().trim();

    if(command.startsWith('@')){
      ee.emit(command,client,data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default',client, data.toString());
  });

  socket.on('error', function(err){
    if(err) throw err;

  });

  socket.on('close', function(){
    pool.forEach(c => {
      c.socket.write(`${client.nickname} has left the building\n`);
    })
  });
});

ee.on('@dm', function(client, string){
  let nicknameOrID = string.split(' ').shift().trim();
  let message = string.split(' ').slice(1).join(' ').trim();

  pool.forEach(c => {
    if(c.nickname === nicknameOrID || c.id === nicknameOrID){
      c.socket.write(`${client.nickname}: ${message}\n`);
      }
    });
  });
ee.on('@exit', function(client){
  pool.forEach((c,index) => {
    if(c.id === client.id) pool.splice(index,1);
  });
  client.socket.end();
});

ee.on('@all', function(client,string){
  pool.forEach(c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});

ee.on('@nickname', function(client,string){
  var prevName = client.nickname;
  client.nickname = string.split(' ').slice().join('_').trim();
  client.socket.write(`${prevName} changed name to ${client.nickname}\n`);
});

ee.on('@me', function(client){
  client.socket.write(`nickname: ${client.nickname}\nID: ${client.id}\n`);
});


ee.on('@people', function(client){
  pool.forEach(c => {
    client.socket.write(`nickname: ${c.nickname}\nID: ${c.id}\n`);
  });
})
ee.on('Default', function(client, string){
  client.socket.write('not a command\n');
});
