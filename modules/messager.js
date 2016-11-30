const events = require('events');
const net = require('net');

module.exports = function(address) {
  //Setup emitter
  let emitter = new events.EventEmitter();

  //Setup server
  let server = net.createServer((socket) => {
    socket.on('data', (data) => {
      emitter.emit('message', data.toString());
    });
  });

  server.listen(3000, '0.0.0.0', () => {
    emitter.emit('ready');
  });

  //Setup client
  let client = new net.Socket();
  console.log(address);

  function connect(netaddress) {
  }

  function send(message) {
    //Can't write if the client is not connected
    client.connect(3000, netaddress, (err) => {
      if (err) throw err;
      // console.log('Client connected');
      client.write(message);
    });
  }

  //Attach exposed methods and return the emitter.
  emitter.send = send;

  return emitter;
};