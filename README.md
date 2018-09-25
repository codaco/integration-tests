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

Test app builds use unique names so that data directories don't interfere with dev builds. After `npm test` runs, these directories are cleared. See `scripts/prepare-packages.js` and `scripts/remove-test-data.js`.

## Writing & debugging webdriver scripts

Integration tests are written mostly like other tests in the app suite. However, debugging problems with the scripts is easier when not run inside a jest runner. The `test:interactive` script runs the same basic outside of the test runner, which leaves the electron apps running even when an assertion fails or an error is thrown:

```
npm test:interactive
```

Jest supports standard debugging as well:

```
node --debug-brk --inspect node_modules/.bin/jest -i
# Now, open `chrome://inspect` in Chrome
```

In both of the above cases, your test data directories won't be cleaned up automatically. To delete the test app data directories, run `npm run clean-test-app-data`.
