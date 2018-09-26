# Network Canvas Integration Tests

## Getting started

```sh
# 1. Check out testable apps and their submodules
git submodule update --init --recursive
# 2. Install npm dependencies for all apps
npm run install:apps
# 3. Create testable builds
npm run build:apps
# 4. Run tests
npm test
```

### Test cleanup

When run with `npm test`, test app builds use unique names so that data directories don't interfere with dev builds. For example, NC will use a data directory called "Network Canvas Integration Test" inside the standard application directory.

After `npm test` runs, these directories are cleared. See `scripts/prepare-packages.js` and `scripts/remove-test-data.js`. Note that these directories aren't cleared after each test; only the full test run.

If you're running `test:interactive` (see below), you may want to manually run the `prepare-packages` script if it hasn't been run.

## Writing and Debugging tests

Test suites use Jest's test runner and Spectron. Spectron uses WebdriverIO, whose [API](http://webdriver.io/api.html), [selector](http://webdriver.io/guide/usage/selectors.html), and [bindings & commands](http://webdriver.io/guide/usage/bindingscommands.html) docs are particularly useful.

Integration tests are written mostly like other tests in the app suite. However, debugging problems with the scripts is easier when not run inside a jest runner. The `test:interactive` script runs the same basic outside of the test runner, which leaves the electron apps running even when an assertion fails or an error is thrown.

To see a list of the available test suites:

```
npm test:interactive
```

While developing a test with a series of interactions, you can add a failing assertion at the end of a test (or skip the teardown phase) to ensure that the app remains open.

To support this mode, each test file must export three values: `setup`, `teardown`, and its array of `tests`. See existing test modules for examples.

Note that when not run with jest, some of the usual globals are unavailable; for example, the `jest` object itself.

In addition to inspecting with interactive mode, you can debug with Jest:

```
node --debug-brk --inspect node_modules/.bin/jest -i
# Now, open `chrome://inspect` in Chrome
```

In both of the above cases, your test data directories won't be cleaned up automatically. To delete the test app data directories, run `npm run clean-test-app-data`.
