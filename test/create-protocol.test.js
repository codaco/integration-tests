/* eslint-env jest */
import fs from 'fs-extra';
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
  await fs.unlink(newProtocol).catch(() => {});
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

  // Enter variable registry
  await architect.client.waitForVisible('.overview__manage-button');
  await architect.client.click('.overview__manage-button');

  // Edit the Node
  await architect.client.element('.variable-registry a .node').click();
  await architect.client.element('[name="displayVariable"]').selectByVisibleText('age');
  await architect.client.waitForVisible('span=Continue');
  await architect.client.click('span=Continue');

  // Save changes
  // Can't waitForVisible; stacked cards remain 'visible' underneath
  await architect.client.pause(750);
  await architect.client.click('span=Back');
  await architect.client.pause(750);
  await architect.client.click('span=Save');

  await architect.client.click('.scene__home');
  const recentlyCreated = await architect.client.elements('.recent-protocols .recent-protocols__protocol');
  expect(recentlyCreated.value).toHaveLength(1);
  expect(fs.existsSync(newProtocol)).toBe(true);
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
