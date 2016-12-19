## Caleb's TCP chat app - User Manual

Welcome to my chat app. This app runs in the command line, utilizing NodeJS and telnet, a native command line utility. It has a simple command line interface (CLI) that allows you to run the server, set up new chat users, and send messages.

### Setup
Clone the repository from GitHub. In the command line, navigate into the root directory of the app and type `npm i.` This will install the necessary dependencies to run the app.

Before local and remote users can chat, the NodeJS server needs to be running. On the host computer, make sure you are in the root directory of the app in the command line, then type `node server.js`. This will start the node server.

For the host computer to also be a chat user, a separate command line tab or window must be open and in the in the root directory of the chat app. For each new tab or window, type `telnet localhost 8000`. This will generate a new chat client with a randomly assigned name.

Users on other computers in the local network may also join the chat. They will need to install the app and run `node server.js` and open a second tab or window as described above. In the second tab or window, instead of typing `telnet localhost 8000`, however, they will need to type `telnet hostIPAddress 8000`, where hostIPAddress is the IP address of the host computer (usually a string of numbers separated by period characters, e.g. '30.124.152.1').

### Commands
* The command format `@handle myusername` will allow a user change their user handle, where 'myusername' is any name or string of characters the user chooses, as long as there are no spaces.
* The command format `@dm username your message goes here` will allow a user to send a message directly to another user by their user handle, where 'username' is their user handle and 'your message goes here' is your message to that user.
* To exit telnet and the chatroom, type `CTRL ]`, press enter, then type `close`, and press enter again. Any other active chatters will be alerted that you left the chatroom.
