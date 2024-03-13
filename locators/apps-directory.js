const SAVE_APPLICATION_LABEL = 'Save';

module.exports = {
    locators: {
        ALL_APPS_OPTION_XPATH: `//Text[@Name=\"All\"]`,
        APP_SEARCH_INPUT_XPATH: `//Text[@Name=\"Search\"]`,
        MESSENGER_APP_XPATH: `//Text[@Name=\"Messenger\"]`,
        SAVE_APPLICATION_XPATH: `//Button[starts-with(@Name, "${SAVE_APPLICATION_LABEL}")]`,
    },
    labels: {
        MESSENGER_LABEL: 'Messenger',
    },
};