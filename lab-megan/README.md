# TCP Server
## About
This project builds a simple chat server using the NodeJS native `net` module. The user has the chance to change their displayed name, send messages to the group and send private direct messages to other users.

This project was created as part of the Code Fellows 401 JavaScript class.

## To Get The Server Running
Open at least two terminal windows. In the first enter the following:
```sh
$ npm i
$ cd lab-megan
$ node server.js
```
## To Connect To The Server
In a separate terminal window:
```sh
$ telnet your-ip 8000
```
or
```sh
telnet localhost 8000
```
If the server terminal window is showing a different port number than 8000 use the new port number.

###### To chat with the group:
`@all Message text here.`
##### To send a private message:
`@dm <recipient-username> Message text here.`
##### To change your username:
`@nickname <new-nickname>`
