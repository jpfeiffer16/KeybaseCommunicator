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
    console.log(`Message: ${ message }`);
  })
  messageSender.send('Test');
});

//UI
// let screen = blessed.screen({
//   smartCSR: true
// });

// screen.title = 'Keybase Communicator';

// let list = blessed.list({
//   top: 0,
//   left: 0,
//   width: '100%',
//   height: '90%',
//   border: {
//     type: 'line'
//   },
// });

// screen.append(list);

// let messageBox = blessed.prompt({
//   top: '90%',
//   left: 0,
//   width: '100%',
//   height: '10%',
//   border: {
//     type: 'line'
//   },
// });

// screen.append(messageBox);


// screen.render();