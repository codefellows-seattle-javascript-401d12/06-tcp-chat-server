'use strict';

const net = require('net');
const EE  = require('events');

// const uuid = require('node-uuid');

const Client = require('./model/client.js');
const PORT = process.env.PORT || 5555;

const server = net.createServer();
const ee = new EE();

const pool = [];

server.on('error', function(err) {
  console.log('server on(error):', err);
});

/*
"Note that if connections exist, this event is not emitted until all connections are ended."
--From the Node.js docs
*/
server.on('close', function() {
  //NOTE: Terminating the node process does not lead to here.
  console.log('server on(close)');
});

server.on('connection', function(socket) {
  var client = new Client(socket);
  console.log('connection:', client.nickname, client.id);

  pool.push(client);

  socket.on('data', function(data) {
    //TODO: Check for junk data

    let words = data.toString().trim().split(' ');
    const command = words[0].trim();
    if(command.startsWith('@')) {
      return ee.emit(command, client, words.slice(1).join(' ').trim());
    }
    ee.emit('@all', client, data.toString());
  });

  socket.on('close', function(err) {
    if(err) console.log(err); //TODO: Something other than console.log
    var index = pool.indexOf(client);
    // if(index == -1) //This is a weird case, right? Maybe not possible.

    //TODO: What might cause splice(index, 1) to fail?
    // var gone = pool.splice(index, 1);
    pool.splice(index, 1);

    //tODO: Verify if next line throws exception (for writing to a socket that might be closed already)
    //  It does throw an exception.
    // gone.socket.write(`good bye ${gone.nickname}`);

    // I'm using Array.prototype.map to just print out the list of nicknames,
    //  rather than the array of client objects, which have a bunch of junk
    //   we really don't need to see logged. Plus, I never used map() much before
    //    and now I'm gonna be mappin all over the place.
    console.log('Pool after hang-up:',pool.map(function(c) {
      return c.nickname;
    }));
    pool.forEach( c => {
      c.socket.write(`${client.nickname} left the conversation\n`);
    });
  });

  socket.on('error', function(err) {
    console.log(err);
  });
});

ee.on('@all', function(client, string) {
  pool.forEach( c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});

ee.on('@who', function(client) {
  client.socket.write('Currently on the chat:\n');
  pool.forEach( c => {
    client.socket.write(` * ${c.nickname}\n`);
  });
});

ee.on('@help', function(client) {
  client.socket.write('You want help, eh? Take off you hoser.\n');
});

ee.on('@quit', handleQuit);
ee.on('@exit', handleQuit);

function handleQuit(client, msg) {
  //TODO: Disconnect the client and remove from the pool.
  console.log('handleQuit', client.nickname, msg);
}

ee.on('@nick', function(client, string) {
  let words = string.trim().split(' ');
  client.nickname = words.shift().trim();
  //TODO: Notify pool that client changed nickname
});

ee.on('@dm', function(client, string) {
  let words = string.trim().split(' ');
  let nickname = words.shift().trim();
  let message = words.join(' ').trim();

  pool.forEach( c => {
    if(c.nickname === nickname) {
      c.socket.write(`${client.nickname} sent you a private msg: ${message}\n`);
    }
  });
});

// server.on('close', function(data) {
//
// });

server.listen(PORT, function() {
  console.log(`server up: ${PORT}`);
});


ee.on('@poker', function(client) {
  pool.forEach( c => {
    c.socket.write(`${client.nickname}: ANTE UP MOFOS!\n`);
    //TODO: Play POKER!
  });
});
