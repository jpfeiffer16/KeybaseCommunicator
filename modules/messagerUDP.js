const events = require('events');

const dgram = require('dgram');

module.exports = function(username) {
  //Sender list
  let senders = [];

  //Setup emitter
  let emitter = new events.EventEmitter();

  //Setup server
  const server = dgram.createSocket('udp4');

  server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
    process.exit(1);
  });

  server.on('message', (msg, rinfo) => {
    if (msg.toString().indexOf('com:') != -1) {
      //Setup sender
      if (senders.filter((sender) => {
        return sender.address == rinfo.address
      }).length == 0) {
        senders.push({
          address: rinfo.address,
          name: msg.toString().split('|')[1]
        });
        //Now send them a com request
        sendComRequest(rinfo.address);
      }
      
    } else{
      let user = msg.toString().split('|')[0].split(':')[1];
      let message = msg.toString().split('|')[1];
      emitter.emit('message', {
        user,
        message
      });
    }
  });

  server.on('listening', () => {
    emitter.emit('ready');
  });

  server.bind({
    address: '0.0.0.0',
    port: 3000
  });

  //Setup client
  const client = dgram.createSocket('udp4');

  client.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
    process.exit(1);
  });

  function send(message, sender) {
    client.send(`msg:${ username }|${ message }`, 3000, sender.address, (err) => {
      if (err) throw err;
      //TODO: Do stuff here if we need to.
    });
  }

  function sendComRequest(address) {
    client.send(`com:|${ username }`, 3000, address);
  }

  function getSenders() {
    return senders;
  }

  //Attach exposed methods and return the emitter.
  emitter.send = send;
  emitter.sendComRequest = sendComRequest;
  emitter.getSenders = getSenders;

  return emitter;
};
