# Simple TCP Chat Server
### what is TCP?
TCP stands for transmission control protocol and is primary way in which applications communicating via an IP network function.

### About this repo
The code included in this repo is intended to be used to set up a server that can then be accessed by multiple users. The server runs exclusively in the terminal and users are able to connect with the server via `telnet`, more details below. In order for the server to run the `node-uuid` package will need to be installed, more details below. There is no limit the number of concurrent connections that can be made to the server. This code was written on Mac OS and has not been tested on Windows OS.

## How to Set up the server
* Fork this repo
* `git clone` the forked copy to your local machine
* Node is required to run the server. Confirm you have `node` installed on your local machine by typing `npm -v` into your terminal. If you don't have node installed please follow the instructions [here](https://nodejs.org/en/).
* The server has a dependency of `node-uuid` so after cloning the repo to your local you must run `npm i` to install all required dependencies.
* In order to turn on the server you will need to run either `nodemon server.js` or `node server.js` if you do not have nodemon installed globally.
* For users to be able to connect to the server the host must provide all users with the IP address for the server and the port the server is hosted on.
 * Your IP address can be found in `Network Preferences`
 * When you start the server via `node server.js` the port number should be printed to the terminal console. You will need to provide this to any users wanting to connect.

## Commands
* `telnet SERVER_IP PORT` - In order to connect to the server users must type into their terminal
 * `SERVER_IP` - provided by server host
 * `PORT` - provided by server host
* `@nickname YOUR_NICKNAME` - set up your nickname in the server.
 * _note: your nickname cannot contain any spaces._
* `@all` - send a message to all users online.
* `@dm USER_NICKNAME MESSAGE` - send a message to a specific user that is online.
