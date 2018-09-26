/* eslint-env jest */
import { makeTestingApp, startApp, stopApp } from '../config/testHelpers';

let architect;

const setup = async () => {
  architect = makeTestingApp('Architect');
  await startApp(architect);
};

const teardown = async () => {
  await stopApp(architect);
};

const showsStartupButtons = async () => {
  expect(await architect.client.isVisible('#create-new-protocol-button')).toBe(true);
  expect(await architect.client.isVisible('#open-existing-protocol-button')).toBe(true);
};

const createsASimpleProtocol = async () => {
  await architect.client.click('#create-new-protocol-button');
  throw new Error('TODO: deal with dialog');
};

describe('Architect', () => {
  beforeEach(setup);
  afterEach(teardown);
  it('shows startup buttons', showsStartupButtons);
  it('creates a simple protocol', createsASimpleProtocol);
});

module.exports = {
  setup,
  teardown,
  tests: [
    showsStartupButtons,
    createsASimpleProtocol,
  ],
};
