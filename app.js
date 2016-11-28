const keybaseCommands = require('./keybaseCommands');
const program = require('commander');
const blessed = require('blessed');
const messager = require('./messager');

//Setup
program
  .option('-r --recipient [string]', 'Reciptient\'s Keybase username')
  .option('-a --address [string]', 'IP Address of Reciptient')
  .parse(process.argv);

//Sanity Checks
if (!program.recipient || !program.address) {
  console.warn('Must include a recipient and an address.');
  console.warn('Run with -h to see usage options.');
  process.exit(1);
}

let messageSender = messager(program.address);
messageSender.on('ready',  () => {
  messageSender.on('message',  (message) => {
    // console.log(`Message: ${ message }`);
    list.addItem(`${ program.recipient }: ${ message }`);
    screen.render();
  })
  messageSender.send('Test');
});

//UI
let screen = blessed.screen({});

screen.title = 'Keybase Communicator';

screen.key(['q'], function() {
  return process.exit(0);
});
// process.on('SIGINT', function() {
//   console.log('Got SIGINT');
// });

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
  messageSender.send(messageBox.value);
  messageBox.clearValue();
  messageBox.readInput();
  screen.render();
});

messageBox.focus();
messageBox.readInput();

screen.render();