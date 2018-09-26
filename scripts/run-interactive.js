/**
 * This runs test script(s) outside of the test runner to make
 * debugging webdriver scripts easier.
 */

// Provide the same `expect` that jest uses
global.expect = require('expect');

// Ignore describe blocks; we'll run the script below.
global.describe = () => {};

process.env.NODE_ENV = 'test';

const { setup, teardown, expectPairingToComplete } = require('../test/pairing.test.js');

setup()
  .then(expectPairingToComplete)
  .then(teardown);
