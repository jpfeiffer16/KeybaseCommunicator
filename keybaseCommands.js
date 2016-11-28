const { exec } = require('child_process');

module.exports = (function() {
  function encrypt(message, recipient, cb) {
    exec(`keybase encrypt -m "${ message }" ${ recipient }`, (error, stdout, stderr) => {
      cb(stdout);
    });
  };

  function decrypt(message) {
    
  };

  return {
    encrypt,
    decrypt
  };
})();