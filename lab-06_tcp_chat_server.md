![cf](https://i.imgur.com/7v5ASc8.png) Lab 06: TCP Chat Server
======

## To Submit this Assignment
  * Fork this repository
  * Write all of your code in a directory named `lab-` + `<your name>` **e.g.** `lab-brian`
  * Push to your repository
  * Submit a pull request to this repository
  * Submit a link to your PR in canvas
  * Write a question and observation on canvas

## Include
* `.gitignore`
* `.eslint`
* `package.json`
* `gulpfile.js`
* `README.md`
 * write a paragraph about your project
 * write documentation on how to get the project running
 * write documentation on how to connect to the server

## Description

* Create a TCP Server using the NodeJS native `net` module
* Create a Client Constructor
* When sockets connect to the server, a new `Client` instance should be made
* All clients should have a unique `id` property - this should come from the use of `node-uuid`
* When sockets are connected with the client pool they should be given event listeners for `data`, `error`, and `close` events
 * When a socket emits the `close` event, the socket should be removed from the client pool
 * When a socket emits the `error` event, the error should be logged on the server
 * When a socket emits the `data` event, the data should be logged on the server and the commands below should be implemented

## Custom commands
* `@all` should trigger a broadcast event
* `@nickname` should allow a user change their nickname
* `@dm` should allow a user to send a message directly to another user by nick name or by their guest id _(unique client id)_
* when a user sends a message, their nickname should be printed
  * **i.e.** `cfcrew: sup chatterz`
