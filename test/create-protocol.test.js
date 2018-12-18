/* eslint-env jest */
import fs from 'fs-extra';
import path from 'path';
import fakeDialog from 'spectron-fake-dialog';

import architectMainWindowIndex from '../config/architectMainWindowIndex';
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
  await architect.client.windowByIndex(architectMainWindowIndex);
};

const teardown = async () => {
  await stopApp(architect);
};

const showsStartupButtons = async () => {
  expect(await architect.client.isVisible('#create-new-protocol-button')).toBe(true);
  expect(await architect.client.isVisible('#open-existing-protocol-button')).toBe(true);
};

const createsASimpleProtocol = async () => {
  await architect.client.waitForVisible('#create-new-protocol-button');
  await architect.client.click('#create-new-protocol-button');

  // Enter variable registry
  await architect.client.waitForVisible('.overview__manage-button');
  await architect.client.click('.overview__manage-button');

  // Edit the Node
  await architect.client.element('.variable-registry a .node').click();
  await architect.client.element('[name="label"]').setValue('mockLabel');
  await architect.client.waitForVisible('span=Continue');
  await architect.client.click('span=Continue');

  // Attempt to save changes
  // Can't waitForVisible; stacked cards remain 'visible' underneath
  await architect.client.pause(750);
  await architect.client.click('span=Back');

  await architect.client.waitForVisible('.timeline-insert-stage-option-grid__preview');
  await architect.client.click('.timeline-insert-stage-option-grid__preview');
  await architect.client.waitForVisible('span=Continue');
  await architect.client.pause(750);
  await architect.client.click('span=Continue');

  await architect.client.pause(750);
  await architect.client.click('span=Save');

  await architect.client.click('.scene__home');
  const recentlyCreated = await architect.client.elements('.recent-protocols .recent-protocols__protocol');
  expect(recentlyCreated.value).toHaveLength(1);
  expect(fs.existsSync(newProtocol)).toBe(true);
};

const createsANewForm = async () => {
  const formSelector = '.editor__subsection .simple-list__item';

  await architect.client.click('#create-new-protocol-button');

  await architect.client.waitForVisible('=MANAGE FORMS');
  await architect.client.click('=MANAGE FORMS');

  await architect.client.waitForVisible(formSelector);
  const builtInForms = await architect.client.elements(formSelector);
  expect(builtInForms.value).toHaveLength(1);

  await architect.client.waitForVisible('=CREATE NEW FORM');
  await architect.client.click('=CREATE NEW FORM');

  await architect.client.waitForVisible('.form-fields-node-select .node');
  await architect.client.click('.form-fields-node-select .node');

  await architect.client.element('[name="title"]').setValue('Form #1');

  await architect.client.waitForVisible('span=Continue');
  await architect.client.click('span=Continue');

  const forms = await architect.client.elements(formSelector);
  expect(forms.value).toHaveLength(2);
};

describe('Architect', () => {
  beforeEach(setup);
  afterEach(teardown);
  it('shows startup buttons', showsStartupButtons);
  it('creates a simple protocol', createsASimpleProtocol);
  it('creates a new form', createsANewForm);
});

module.exports = {
  setup,
  teardown,
  tests: [
    showsStartupButtons,
    createsASimpleProtocol,
    createsANewForm,
  ],
};
