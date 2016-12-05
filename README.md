# KeybaseCommunicator
A simple Keybase encrypted local chat app.

## Usage

### Installing

#### Locally from source
`$ git clone git@github.com:jpfeiffer16/KeybaseCommunicator.git`

`$ cd KeybaseCommunicator`

Install local dependencies:

`$ npm install`

#### Globally via npm

`$ npm install -g keybasecommunicator`

> Note: you may need to preface the command with `sudo` if you're on linux/bsd.

Now you can launch the app from the terminal with the `kcom` command.

EG:

`$ kcom -u <keybase username>`

and then connect to that with

`$ kcom -u <keybase username> -a <ip address of machine running previous command>`

### Running
From source: `node app.js --help`

For example to chat encrypted with localhost/yourself: `node app.js -u <yourkeybasename> -a localhost -e`

To exit the app, type `exit` into the chat box or press q when the chat box is not highlighted.
