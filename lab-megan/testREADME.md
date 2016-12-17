# TCP Server
## About
This project builds a simple chat server using the NodeJS native `net` module. The user has the chance to change their displayed name, send messages to the group and send private direct messages to other users.
###### To chat with the group:
`@all Message text here.`
##### To send a private message:
`@dm Recipient-username Message text here.`
##### To change your username:
`@nickname New-nickname`

## To Get The Server Running
```sh
$ cd lab-megan
$ npm i init node-uuid
$ node server.js
```
## To Connect To The Server
In a separate terminal window
```sh
$ telnet your-ip port8000
```
or
```sh
telnet localhost port8000
```
