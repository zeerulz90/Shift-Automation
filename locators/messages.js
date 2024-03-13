const userProfile = require('../config/user-profile');

const GOOGLE_ACCOUNT_LABEL = 'Google Account';
const ADD_WORKSPACE_EMAIL_LABEL = 'Email for your Workspace';

module.exports = {
    locators: {
        FIRST_AVATAR_XPATH: `//Button[starts-with(@Name, "${GOOGLE_ACCOUNT_LABEL}") and contains(@Name, "${userProfile.firstUser.email}")]`,
        FIRST_LEFT_USER_XPATH: `//Button[@Name=\"${userProfile.firstUser.email}\"]`,
        SECOND_AVATAR_XPATH: `//Button[starts-with(@Name, "${GOOGLE_ACCOUNT_LABEL}") and contains(@Name, "${userProfile.secondUser.email}")]`,
        SECOND_LEFT_USER_XPATH: `//Button[@Name=\"${userProfile.secondUser.email}\"]`,
        INBOX_DOCUMENT_XPATH: `//Document[starts-with(@Name, "Inbox")]`,
        ADD_TO_SHIFT_XPATH: `//Button[@Name=\"Add to Shift\"]`,
        ADD_WORKSPACE_XPATH: `//Button[@Name=\"Add Workspace\"]`,
        ADD_WORKSPACE_EMAIL_XPATH: `//Edit[starts-with(@Name, "${ADD_WORKSPACE_EMAIL_LABEL}")]`,
        CREATE_WORKSPACE_XPATH: `//Button[@Name=\"Create Workspace\"]`,
        ADD_APPLICATION_XPATH: `//Button[@Name=\"Add Application\"]`,
    },
    labels: {
        NAME_ATTRIBUTE: 'Name',
    },
};