const { Builder } = require('selenium-webdriver');

const constants = require('../config/constants');
const { PROJECT_ROOT_DIR } = require('../root');

const delay = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
}

const launchShiftApp = async () => {
    const shiftPath = PROJECT_ROOT_DIR + constants.SHIFT_PATH + constants.SHIFT_FILENAME;

    // Establish WinAppDriver session and launch Shift application
    const capabilities = {
      app: shiftPath,
      platformName: 'Windows',
      browserName: 'chrome',
      'ms:waitForAppLaunch': '3',
    };

    // return the session and launch Shift app
    return await new Builder()
        .usingServer(constants.WINAPPDRIVER_URL) // WinAppDriver server URL
        .withCapabilities(capabilities)
        .build();
}

module.exports = {
    launchShiftApp,
    delay,
};