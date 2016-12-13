### TCP Chat Project

This is a chat server project where you can chat with people! Woo!

A visualization of the TCP Chat Server project may be seen below (credit to [Brian Nations](https://github.com/bnates)):

![alt text](https://raw.githubusercontent.com/codefellows/seattle-javascript-401d12/master/06-tcp_servers/demo/visualization/tcp.png)

### Get the Project Running

To get this project running, type the following in your command line:

1. `git clone https://github.com/brittdawn/06-tcp-chat-server`
2. `cd 06-tcp-chat-server`
3. `npm i`
4. `node server.js`

You will now see the phrase "server up: 3000" if you have not already specified a port number.

### Test the Chat Server

1. Open a new terminal located at the root of this project and type `telnet localhost 3000`

2. Play with the commands below.

### Interacting with the Chat Room

You can type `@all <your message>` in the command line to broadcast and interact with folks in the chat room.
You can type `@dm <username> <message>` in the command line to send a direct message.
You can type `@nickname <your nickname>` to change your nickname.
To leave the chat room, hold `ctrl + ]`. When the telnet appears, type `quit`.

### Finding Your IP Address (If You Want)

You can also open another terminal and add your IP address.

1. Figure out your IP address.

> Hint: If using a Mac, go to your System Preferences --> Network, and you will see your IP address.

2. Open up a new terminal window located at the root of this project.

3. Type `telnet [paste-your-IP-here] 3000`
