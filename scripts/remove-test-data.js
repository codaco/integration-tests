/* eslint-disable no-console */
const fs = require('fs');
const fsExtra = require('fs-extra');

const {
  appNames,
  getAppDataDir,
  getPackageFile,
  getTestProductName,
} = require('../config/paths');

appNames.forEach((appName) => {
  const packageFile = getPackageFile(appName);
  let contents;
  let testAppDataDir;
  try {
    contents = fs.readFileSync(packageFile, 'utf-8');
    const json = JSON.parse(contents);
    const productName = getTestProductName(json.productName);
    testAppDataDir = getAppDataDir(productName);
  } catch (err) {
    console.log(`Skipping ${packageFile}: not found`);
    if (err.code !== 'ENOENT') {
      console.error(err);
    }
    return;
  }

  if (!testAppDataDir
      || testAppDataDir.indexOf('Network Canvas') < 0
      || testAppDataDir.indexOf('Integration Test') < 0
      || testAppDataDir.indexOf('..') >= 0) {
    console.warn('Invalid app directory', testAppDataDir);
    return;
  }

  try {
    fsExtra.removeSync(testAppDataDir);
  } catch (err) {
    console.log(`Cannot delete ${packageFile}`);
    if (err.code !== 'ENOENT') {
      console.error(err);
    }
  }
});
