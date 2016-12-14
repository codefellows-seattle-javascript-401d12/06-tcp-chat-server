#Kyler's chat server

##About
This is my TCP chat server! It was a fun project, I did not know TCP was so easy to use in Node.

##Getting started
`npm start <port>`

Connections, disconnections, errors, and any user data sent will be logged to the console. `Ctrl-C` to exit.

##Usage
Clients can connect using `telnet <hostname/ip> <port>`. The server supports the following commands:

*`@exit` to disconnect
*`@dm <nick/id> <message>` to message a user by nickname or id
*`@nick <new nick>` to change your nickname
*`@all <message>` to message all users

vim sucks
