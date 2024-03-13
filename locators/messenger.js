const APPLICATION_EMAIL_LABEL = 'Email or phone number';

module.exports = {
    locators: {
        APPLICATION_EMAIL_XPATH: `//Edit[starts-with(@Name, "${APPLICATION_EMAIL_LABEL}")]`,
        APPLICATION_PASSWORD_XPATH: `//Edit[@Name=\"Password\"]`,
        LOG_IN_XPATH: `//Button[@Name=\"Log in\"]`,
        CHAT_TABLE_XPATH: `//Table[@Name=\"Chats\"]`,
        NO_MESSAGES_XPATH: `//Text[@Name=\"No Messages\"]`,
        NO_CHATS_SELECTED_XPATH: `//Text[@Name=\"No chats selected\"]`,
    },        
};