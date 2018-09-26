/* eslint-disable no-console */

/**
 * This runs test script(s) outside of the test runner to make
 * debugging webdriver scripts easier.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { getTestSuiteFiles } = require('../config/paths');

// Provide the same `expect` that jest uses
global.expect = require('expect');
// Ignore describe blocks; we'll run the script below.
global.describe = () => {};

process.env.NODE_ENV = 'test';

const testSuiteName = process.argv[2];
const testSuiteFilepath = path.join(__dirname, '..', 'test', `${testSuiteName}.test.js`);

// Each test module should export the following
let setup;
let teardown;
let tests;

if (!fs.existsSync(testSuiteFilepath)) {
  console.log('Usage: npm run test:interactive [test-suite-name]');
  console.log();
  console.log(getTestSuiteFiles().map(f => `npm run test:interactive ${f}`).join(os.EOL));
  console.log();
  process.exit(0);
}

try {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  ({ setup, teardown, tests } = require(testSuiteFilepath));
} catch (err) {
  console.log('Error requiring test suite:');
  console.error(err);
  process.exit(1);
}

if (!tests) {
  console.error('No tests found');
  process.exit(1);
}

tests.reduce((promise, test) => promise.then(setup).then(test).then(teardown), Promise.resolve());

process.on('unhandledRejection', (err) => {
  console.error(err);
  // Leave process running so developer can inspect test app
});
