const fs = require('fs');
const path = require('path');

const appsDir = path.join(__dirname, '..', 'apps');
const generatedDataDir = path.join(__dirname, '..', 'test', 'generated_data');
const appNames = fs.readdirSync(appsDir).filter(
  f => fs.statSync(path.join(appsDir, f)).isDirectory(),
);

const getTestSuiteFiles = () => {
  const testDir = path.join(__dirname, '..', 'test');
  const files = fs.readdirSync(testDir);
  const testSuffix = /\.test\.js$/;
  return files.filter(f => (testSuffix).test(f)).map(f => f.replace(testSuffix, ''));
};

const getPackageFile = appName => path.resolve(appsDir, appName, 'www', 'package.json');

/**
 * Produces a new productName which can be used to change the app data directory for easy cleanup.
 * @param  {string} productName from the original package.json. Example: "Network Canvas Server"
 * @return {string} a name for the test build. Example: "Network Canvas Server Integration Test"
 */
const getTestProductName = (productName) => {
  const suffix = ' Integration Test';
  return `${productName.replace(suffix, '')}${suffix}`;
};

/**
 * See also https://electronjs.org/docs/api/app#appgetpathname
 * @param  {string} testProductName full app name used in the test build.
 *                                  Example: "Network Canvas Server Integration Test".
 * @return {string} the "appData" directory used by Electron.
 */
const getAppDataDir = (testProductName) => {
  let dir;
  switch (process.platform) {
    case 'darwin':
      dir = path.join(process.env.HOME, 'Library', 'Application Support');
      break;
    case 'win32':
      dir = process.env.APPDATA;
      break;
    // case 'linux':
    //   // $XDG_CONFIG_HOME or ~/.config on Linux
    //   break;
    default:
      dir = null;
  }
  return path.resolve(dir, testProductName);
};

module.exports = {
  appsDir,
  generatedDataDir,
  appNames,
  getAppDataDir,
  getPackageFile,
  getTestProductName,
  getTestSuiteFiles,
};
