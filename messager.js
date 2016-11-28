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

  server.listen(3000, '0.0.0.0');

  //Setup client
  let client = new net.Socket();
  client.connect(3000, address, (err) => {
    if (err) throw err;
    emitter.emit('ready');
  });

  function send(message) {
    client.write(message);
  }

  //Attach  exposed methods and return the emitter.
  emitter.send = send;

  return emitter;
};