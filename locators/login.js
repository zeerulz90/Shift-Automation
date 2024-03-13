const CHECKBOX_LABEL = 'Privacy Policy and Terms of Use';
const STREAMLINE_SETUP_LABEL = 'Streamline Setup';
const ENGLISH_US_LABEL = 'English (United States)';
const EMAIL_INPUT_LABEL = 'Email or phone';
const PASSWORD_INPUT_LABEL = 'Enter your password';

module.exports = {
    locators: {
        SIGN_IN_XPATH: `//Button[@Name=\"Sign in with Google\"]`,
        TERMS_OF_USE_CHECKBOX_XPATH: `//CheckBox[starts-with(@Name, "${CHECKBOX_LABEL}")]`,
        STREAMLINE_SETUP_CHECKBOX_XPATH: `//CheckBox[starts-with(@Name, "${STREAMLINE_SETUP_LABEL}")]`,
        LOCALE_COMBO_BOX_XPATH: '//ComboBox',
        ENGLISH_US_LOCALE_OPTION_XPATH: `//ListItem[starts-with(@Name, "${ENGLISH_US_LABEL}")]`,
        EMAIL_INPUT_XPATH: `//Edit[starts-with(@Name, "${EMAIL_INPUT_LABEL}")]`,
        PASSWORD_INPUT_XPATH: `//Edit[starts-with(@Name, "${PASSWORD_INPUT_LABEL}")]`,
        CONTINUE_BUTTON_XPATH: `//Button[@Name=\"Continue\"]`,
        ALLOW_BUTTON_XPATH: `//Button[@Name=\"Allow\"]`,
        MODAL_XPATH: `//Document[@Name=\"Sign in - Google Accounts\"]`,
    },
};