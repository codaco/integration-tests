/* eslint-env jest */
import path from 'path';
import fakeDialog from 'spectron-fake-dialog';
import { makeTestingApp, startApp, stopApp } from '../config/testHelpers';
import { generatedDataDir } from '../config/paths';

let architect;
const newProtocol = path.join(generatedDataDir, 'mock.netcanvas');

const setup = async () => {
  architect = makeTestingApp('Architect');
  await fakeDialog.apply(architect);
  await startApp(architect);
  await fakeDialog.mock([{ method: 'showSaveDialog', value: newProtocol }]);
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
