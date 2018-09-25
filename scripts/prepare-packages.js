/* eslint-disable no-console */
const fs = require('fs');
const { appNames, getPackageFile, getTestProductName } = require('../config/paths');

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
