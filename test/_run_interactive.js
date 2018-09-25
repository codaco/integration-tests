global.expect = require('expect');

global.describe = () => {};

process.env.NODE_ENV = 'test';

const { setup, teardown, expectPairingToComplete } = require('./pairing.spec.js');

setup()
  .then(expectPairingToComplete)
  .then(teardown);
