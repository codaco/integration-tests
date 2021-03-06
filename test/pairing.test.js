/* eslint-env jest */
import { makeTestingApp, startApps, stopApps } from '../config/testHelpers';

let ncApp;
let serverApp;

const setup = async () => {
  serverApp = makeTestingApp('Server');
  ncApp = makeTestingApp('Network-Canvas');
  await startApps(ncApp, serverApp);
};

const teardown = async () => {
  await stopApps(ncApp, serverApp);
};

const expectPairingToComplete = async () => {
  await ncApp.client.click('.setup__server-button');

  await ncApp.client.waitForExist('.server-card--clickable');
  await ncApp.client.click('.server-card--clickable');

  await serverApp.client.waitForVisible('.pairing-prompt');
  await serverApp.client.pause(50); // shouldn't be needed?, but fails intermittently otherwise
  await serverApp.client.click('.pairing-prompt .button:last-child');

  await serverApp.client.waitForVisible('.pairing-pin__code');
  const pairingCode = await serverApp.client.getText('.pairing-pin__code');
  expect(pairingCode.length).toBe(16);

  const inputs = await ncApp.client.$$('.pairing-form input');
  expect(inputs.length).toBe(16);

  inputs.forEach(async (input, i) => {
    await ncApp.client.setValue(`#pairing-code-character-${input.index}`, pairingCode[i]);
  });

  await ncApp.client.waitForVisible('.pairing-form__submit .button');
  await ncApp.client.click('.pairing-form__submit .button');

  expect(await ncApp.client.isVisible('.protocol-import')).toBe(true);

  await serverApp.client.waitForVisible('.modal--pairing-confirmation');
  const confirmText = await serverApp.client.getText('.modal--pairing-confirmation');
  expect(confirmText).toMatch('Your device is now paired');
};

// Assumes pairing has completed in expectPairingToComplete
const showsThePairedServer = async () => {
  await ncApp.client.click('.setup__server-button');
  await ncApp.client.waitForExist('.server-card__label');
  expect(ncApp.client.getText('.server-setup__server .button')).resolves.toMatch(/Unpair/i);
};

describe('Server/Client pairing', () => {
  beforeEach(setup);
  afterEach(teardown);
  it('completes successfully', expectPairingToComplete);
  it('shows the paired server', showsThePairedServer);
});

module.exports = {
  setup,
  teardown,
  tests: [
    expectPairingToComplete,
    showsThePairedServer,
  ],
};
