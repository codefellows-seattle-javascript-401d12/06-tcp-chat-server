# TCP Chat Server

### Danny's lab 06

This TCP Chat Server allows terminals to connect via telnet to communicate through message. It also allows users to:

 - change their nickname with @nickname
 - send direct messages with @dm
 - message to all in the chatroom with @all

Clone down this repository with `git clone https://github.com/dbecker4130/06-tcp-chat-server.git`

In the parent directory run `npm i` to install proper dependencies.

Then run `node server.js` This will connect to the server. Upon connection, you should see the message: `"server live on port....."`.
If no connection, make sure your PORT is set up correctly in .bashrc, or that the PORT properly defaults to 3000.

Users can connect to your server through telnet. Run `telnet localhost <port>`. Alternatively, you can run `telnet <your IP address>`.
