# TCP Chat server

This project creates a local server and allows users to connect and send chat
messages through the terminal. When sending messages, you can use various
commands to send messages to all users or to a specific user.

## How to run

Install any Dependencies from the package.json file into the project root
directory. Using node, you can run the command ```npm i``` to install all
depenenedcies.

## Running server

Run the ```server.js``` file using command ```node server.js```. You should see ```PORT:8000 running``` in terminal.
Every new user that connects, you will see a message logged in your terminal. Example ```user78 connected successfully```.

## Connecting to server

In an new terminal window, connect to the local server by using the command ```telnet localhost 8000```.
Other users can connect to your server by using command ```telnet [your ip address] 8000```. When each user connects, they will
be assigned a unique nickname and id.

## Commands

Once you are connected to the server, you can initiate commands by using ```@``` . These are commands you can use:

To set nickname: ```@nickname + [string]``` Example: ```@nickname mickey```. A message in the terminal will print each time a
user sets a nickname.

To send direct message to user: ```@dm + [user nickname] + [string]```. Example: ```@dm mickey how are you?```.

To send message to all users: ```@all + [string]```. Example: ```@all hello everyone```.

Usuable commands: ```@help```.

## Disconnecting from server.

User can disconnect from the server by entering ```control``` + ```]``` then entering ```q```. A message will log in the server
terminal indicating a user has disconnected.

## Closing server

In server terminal, enter ```control``` + ```c```.
