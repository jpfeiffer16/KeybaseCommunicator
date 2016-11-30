const keybaseCommands = require('./modules/keybaseCommands');
const program = require('commander');
const blessed = require('blessed');
const messager = require('./modules/messagerUDP.js');
const ngrok = require('ngrok');

//Setup
program
  .option('-u --username [string]', 'Your Keybase username\t[required]')
  .option('-a --address [string]', 'IP Address of Reciptient\t[optional]')
  .option('-e --encrypt [bool]', 'Encrypt the messages with keybase\t[optional]')
  .option('-n --ngrok [bool]', 'Use ngrok to chat over the internet\t[optional]')
  .parse(process.argv);

//Sanity Checks
if (!program.username) {
  console.warn('Must include a username.');
  console.warn('Run with -h to see usage options.');
  process.exit(1);
}

//Setup ngrok if the user wants it.
if  (program.ngrok) {
  ngrok.connect(3000, function (err, url) {
    if (err) throw err;
    console.log('Tunnel at: \n%s . Press any key to enter the app.', url);
    let stdin = process.stdin;
    stdin.setRawMode( true );

    stdin.resume();

    stdin.setEncoding( 'utf8' );

    stdin.on('data', function( key ){
      // ctrl-c ( end of text )
      if ( key === '\u0003' ) {
        process.exit();
      }
      
      stdin.setRawMode(false);
      stdin.removeAllListeners();
      main();
    });
  });
} else {
  main();
}


function main() {
  // console.log('Main');
  let messageSender = messager(program.username);
  messageSender.on('ready',  () => {
    if (program.address) {
      messageSender.sendComRequest(program.address);
    }
    messageSender.on('message',  (info) => {
      let {message, user} = info;
      if (program.encrypt) {
        keybaseCommands.decrypt(message, (decryptedMessage) => {
          addMessage(user, decryptedMessage);
        });
      } else {
        addMessage(user, message);
      }
    });
  });

  //UI
  let screen = blessed.screen({});

  screen.title = 'Keybase Communicator';

  screen.key(['q'], function() {
    return process.exit(0);
  });

  let form = blessed.form({
    parent: screen,
    keys: true,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  });


  let list = blessed.list({
    parent: form,
    top: 0,
    left: 0,
    width: '100%',
    height: '90%',
    border: {
      type: 'line'
    },
  });

  let messageBox = blessed.textbox({
    parent: form,
    top: '90%',
    left: 0,
    width: '100%',
    height: '10%',
    border: {
      type: 'line'
    },
  });

  messageBox.on('submit', () => {
    if (messageBox.value === 'exit') process.exit();
    if (program.encrypt) {
      let senders = messageSender.getSenders();
      senders.forEach((sender) => {
        keybaseCommands.encrypt(messageBox.value, sender.name, (encryptedMessage) => {
          messageSender.send(encryptedMessage, sender);
        });
      });
    } else {
      let senders = messageSender.getSenders();
      senders.forEach((sender) => {
        messageSender.send(messageBox.value, sender);
      });
    }
    
    addMessage('you', messageBox.value);
    messageBox.clearValue();
    messageBox.readInput();
    screen.render();
  });

  messageBox.focus();
  messageBox.readInput();

  screen.render();

  function addMessage(user, message) { 
    list.addItem(`${ user }: ${ message }`);
    screen.render();
  }

}
