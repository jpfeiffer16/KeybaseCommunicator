const keybaseCommands = require('./keybaseCommands');
const program = require('commander');
const blessed = require('blessed');
const messager = require('./messager');
const ngrok = require('ngrok');

//Setup
program
  .option('-r --recipient [string]', 'Reciptient\'s Keybase username')
  .option('-a --address [string]', 'IP Address of Reciptient')
  .option('-e --encrypt [bool]', 'Encrypt the messages with keybase')
  .option('-n --ngrok [bool]', 'Use ngrok to chat over the internet')
  .parse(process.argv);

//Sanity Checks
if (!program.recipient) {
  console.warn('Must include a recipient.');
  console.warn('Run with -h to see usage options.');
  process.exit(1);
}

//Setup ngrok if the user wants it.
if  (program.ngrok) {
  ngrok.connect(3000, function (err, url) {
    if (err) throw err;
    console.log('Tunnel at: \n%s . Press any key to enter the app.', url);
    let stdin = process.stdin;
    // without this, we would only get streams once enter is pressed
    stdin.setRawMode( true );

    // resume stdin in the parent process (node app won't quit all by itself
    // unless an error or process.exit() happens)
    stdin.resume();

    // i don't want binary, do you?
    stdin.setEncoding( 'utf8' );

    // on any data into stdin
    stdin.on('data', function( key ){
      // ctrl-c ( end of text )
      if ( key === '\u0003' ) {
        process.exit();
      }
      // write the key to stdout all normal like
      // process.stdout.write( key );
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
  let messageSender = messager(program.address);
  messageSender.on('ready',  () => {
  messageSender.on('message',  (message) => {
      if (program.encrypt) {
        keybaseCommands.decrypt(message, (decryptedMessage) => {
          addMessage(program.recipient, decryptedMessage);
        });
      } else {
        addMessage(program.recipient, message);
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
      keybaseCommands.encrypt(messageBox.value, program.recipient, (encryptedMessage) => {
        messageSender.send(encryptedMessage);
      });
    } else {
      messageSender.send(messageBox.value);
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
