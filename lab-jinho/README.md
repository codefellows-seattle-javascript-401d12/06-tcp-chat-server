# TCP CHAT SERVER

### General description

This is a TCP Chat Server. Allows multiple clients to communicate with each other through localhosts.

### How do I use this app?

* Clone this repo and run command `npm i` in terminal to install all of the dependencies.

* Open 3 panes in your terminal (command 'T' twice) to virtually view and manipulate self-made clients communicate.

* Be sure to be in root of repo directory before attempting to initiate the port to the server. To do this, run `node server.js` in the first terminal pane.

* To connect to the server, run `telnet localhost 3000` in the second and third terminal panes.

* Once connected to the server as a client, you can communicate to virtual clients by using the following commands:
  * `@dm` allows to send a message directly to another client
  * `@all` allows to send a message to all clients
  * `@nickname` allows to change client nickname (i.e. `@nickname bob` will change your nickname to `bob`)
