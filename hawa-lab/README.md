### TCP Chat Server

This is a program that will allow terminals to communicate with each other through a simple chat room via the telnet command.

1. Clone down this repository, then navigate to the hawa-lab directory.
2. Run < npm i > in your terminal to install all of the node dependencies you need to run the chat-room.
2. Then, from the hawa-lab directory, run node by typing < node server.js > in your terminal.
3. This will startup your chat server with the message "Server up on: (PORT number)".
4. Other users may connect by typing < telnet localhost (whatever the PORT number was) > on another terminal.
    --> You can test this on your own machine by opening up new terminal tab or pane.
    --> Enter the command < telnet localhost (whatever the PORT number was) >.
    --> Use the following commands:
        1. '@all' to talk to every client that is connected.
        2. '@dm' following a name and message to directly message another user.
        3. '@nickname' to change your nickname.
        4. Open a few different terminals and then force delete one of terminals to see if you get a message that tells you if the client is disconnected from the chat-room. You should also get error message as well.
5. Enjoy Slack's next biggest competition! :)
