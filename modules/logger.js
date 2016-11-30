const fs = require('fs');

module.exports = (function() {
  let stream = fs.createWriteStream('./log.txt');
  // console.log('logger');
  function log(message) {
    stream.write(`${ message }\n`);
  }
  return {
    log
  }
})();