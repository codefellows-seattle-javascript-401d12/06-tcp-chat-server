'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');

const PORT = 3000;
const server =  net.createServer();

const ee = new EE;
const pool = [];
server.on('connection', function(socket){
  var client = new Client(socket);
  pool.push(client);

  socket.on('data', function(data){
   const command =  data.toString();
   console.log('command: ',command.split(' '));
  });
});


server.listen(PORT, function(){
 console.log('PORT: ', PORT);
});
