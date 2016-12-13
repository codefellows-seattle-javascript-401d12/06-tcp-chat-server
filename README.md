# TCP CHAT SERVER

### General description

This is a basic app for a TCP Chat Server, which allows multiple clients to communicate with each other through their terminal windows.

### How do I use this app?

* Clone this repo and run the command `npm i` in your terminal to install all of the dependencies.

* Open 3 panes in your terminal to see how clients can communicate.

* Be sure that you are in the root of the repo directory before attempting to initiate the port to the server. To do this, run `node server.js` in the first terminal pane.

* To connect to the server, you must run `telnet localhost 8000` in the second and third terminal panes.

* Once you are connected to the server as a client, you can communicate to others by using the following commands:
  * `@dm` will allow you to send a message directly to another client
  * `@all` will allow you to send a message to all clients
  * `@nickname` will allow you to change your nickname
    * **i.e.** `@nickname bob` will change your nickname to `bob`
