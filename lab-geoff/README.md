# Geoff's TCP Server

This project is a simple chat server app that allows telnet clients to connect and then interact with the server, and other clients by way of the server.

# Setup & Go

- Clone this repository, run `git clone https://github.com/geoffsimons/06-tcp-chat-server.git`
- Run `npm i` to install dependencies
- To startup the server: `node server.js [port]`
--`port` defaults to the PORT environment variable
- Use a telnet client to connect to the port
- Have fun...maybe you'll find an easter egg.

# Command API
- `@nick <nickname>`
-- Sets your nickname that other people see
- `@dm <nickname> <message>`
-- Send message to *ONLY* the client with nickname
- `@who`
-- See who is currently connected
- `@quit` | `@exit`
-- Leave the conversation and hang-up
- `@help`
-- See help and get list of commands when connected
