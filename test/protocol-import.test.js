/* eslint-env jest */
import fs from 'fs-extra';
import path from 'path';
import fakeDialog from 'spectron-fake-dialog';

import architectMainWindowIndex from '../config/architectMainWindowIndex';
import { makeTestingApp, startApp, stopApps } from '../config/testHelpers';
import { generatedDataDir } from '../config/paths';

let architect;
let server;
const newProtocol = path.join(generatedDataDir, 'mock.netcanvas');

const setup = async () => {
  architect = makeTestingApp('Architect');
  server = makeTestingApp('Server');

  // fakeDialog maintains state & assumes a single app, but we can mock each in sequence
  await fakeDialog.apply(architect);
  await startApp(architect);
  await fakeDialog.mock([{ method: 'showSaveDialog', value: newProtocol }]);
  await architect.client.windowByIndex(architectMainWindowIndex);

  await fakeDialog.apply(server);
  await startApp(server);
  await fakeDialog.mock([
    { method: 'showOpenDialog', value: [newProtocol] }, // choose file to import
    { method: 'showMessageBox', value: 0 }, // confirm successful import
  ]);

  await fs.unlink(newProtocol).catch(() => {});
};

const teardown = async () => {
  await stopApps(architect, server);
};

const isImportedByServer = async () => {
  await architect.client.click('#create-new-protocol-button');
  await architect.client.waitForVisible('.overview__manage-button');

  // URL change after import signals new protocol has been imported
  const originalUrl = await server.client.getUrl();
  await server.client.click('.protocol-thumbnail--add');
  await server.client.waitUntil(async () => (await server.client.getUrl()) !== originalUrl);

  const protocols = await server.client.elements('.app__sidebar a.protocol-thumbnail');
  expect(protocols.value).toHaveLength(1);
};

describe('A new protocol', () => {
  beforeEach(setup);
  afterEach(teardown);
  it('is imported by Server', isImportedByServer);
});

module.exports = {
  setup,
  teardown,
  tests: [
    isImportedByServer,
  ],
};
