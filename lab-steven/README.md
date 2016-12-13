#TCP Chat Server
###Steven Bateman's submission for lab 06

This is a program that will allow terminals to communicate with each other through a simple chat room via the telnet command.

Clone down this repository, then navigate to the ```lab-steven``` directory and run ```npm i```. Then, from the ```lab-steven``` directory, run ```node server.js```. This will startup your chat server and you will see the message: ```"Server started on port <port#>"```.

Other users may now connect to your server through telnet. You can test this on your own machine by opening up new terminal windows, then entering the command ```telnet 127.0.0.1 <port>```. Alternatively, you can run ```telnet localhost <port>```. You may run ```@help``` while connected to get a list of acceptable commands while chatting.
