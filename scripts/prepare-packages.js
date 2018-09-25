/* eslint-disable no-console */
const fs = require('fs');
const { appNames, getPackageFile, getTestProductName } = require('../config/paths');

/**
 * By setting a different productName on the test builds, we cause Electron
 * to use a different dataDir, and we don't interfere with dev (or prod) builds.
 */
appNames.forEach((appName) => {
  const packageFile = getPackageFile(appName);
  let contents;
  try {
    contents = fs.readFileSync(packageFile, 'utf-8');
    const json = JSON.parse(contents);
    json.productName = getTestProductName(json.productName);
    fs.writeFileSync(packageFile, JSON.stringify(json, null, 2));
  } catch (err) {
    console.log(`Skipping ${packageFile}: not found`);
    if (err.code !== 'ENOENT') {
      console.error(err);
    }
  }
});
