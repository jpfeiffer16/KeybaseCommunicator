const EventEmitter = require('EventEmitter');
const net = require('net');

module.exports = (function() {
  //Setup server
  let server = net.createServer((socket) => {
    socket.write('Hi');
  });


  server.listen(3000, '0.0.0.0');

  return {};
})();