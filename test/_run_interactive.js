global.expect = require('expect');

global.describe = () => {};

const { setup, teardown, expectPairingToComplete } = require('./pairing.spec.js');

setup()
  .then(expectPairingToComplete)
  .then(teardown);
