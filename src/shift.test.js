const { chromium } = require('playwright');
const { By, Key, until } = require('selenium-webdriver');
const fs = require('fs');

const constants = require('../config/constants');
const userProfile = require('../config/user-profile');

const { PROJECT_ROOT_DIR } = require('../root');

const signInLocators = require('../locators/login');
const messagesLocators = require('../locators/messages');
const appsDirectoryLocators = require('../locators/apps-directory');
const messengerLocators = require('../locators/messenger');

const { installApplication, getFileVersion } = require('../utils/terminal');
const { launchShiftApp, delay } = require('../utils/miscellaneous');

describe('Download, install and test Shift functionalities', function () {
    // Set the default mocha timeout for all tests in this suite
    this.timeout(constants.DEFAULT_TIMEOUT); // (500 seconds)

    // Variables which are used commonly across two or more tests
    let browser;
    let installerVersionNumber;
    let installerPath;
    let shiftPath;
    let page;
    let driver;
    let addToShiftButton;

    it('Verify Shift downloads properly and grab version from installer filename', async function () {
        // Set up browser context to launch Shift website in Chrome
        browser = await chromium.launch({
            headless: false,
            defaultBrowserOptions: {
                timeout: constants.DEFAULT_TIMEOUT, // Set timeout to 30 seconds
            },
        });
        const context = await browser.newContext({ acceptDownloads: true });
        page = await context.newPage();

        // Need expect for assertions
        const { expect } = await import('chai');

        // Open Shift website
        await page.goto(constants.SHIFT_URL);

        // Download Shift
        const [ download ] = await Promise.all([
            page.waitForEvent('download'), // wait for download to start
            page.getByRole('link', { name: constants.DOWNLOAD_SHIFT_BUTTON_LABEL }).first().click(),
        ]);

        // Save shift installer executable file in the 'Downloads' folder of our project path 
        installerPath = PROJECT_ROOT_DIR + constants.DOWNLOADS_PATH + download.suggestedFilename();
        await download.saveAs(installerPath);

        // Verify download is successful
        const fileExists = fs.existsSync(installerPath);
        expect(fileExists).to.be.true;

        // Grab the version number from the installer filename
        const filename = download.suggestedFilename().split('/').pop();
        installerVersionNumber = filename.match(constants.VERSION_MATCH_REGEX)[0];
        expect(installerVersionNumber).not.to.be.null;
    });

    it('Install Shift and verify versions from installer and installed filenames match', async function () {
        // Need expect for assertions
        const { expect } = await import('chai');

        // Install Shift application
        const installedPath = PROJECT_ROOT_DIR + constants.SHIFT_PATH;
        installApplication(installerPath, installedPath);
        
        // Allow some time before we attempt to run terminal command to retrieve app version
        await delay(5000);

        // Get version number from installed version
        shiftPath = installedPath + constants.SHIFT_FILENAME;
        const installedVersionNumber = await getFileVersion(shiftPath);

        // Match version from installer version and installer file
        expect(installerVersionNumber).to.equal(installedVersionNumber);
    });

    it('Launch Shift, login with first user and verify unread message count', async function () {
        // Need expect for assertions
        const { expect } = await import('chai');

        // Allow some time before we attempt to launch Shift application, otherwise this can fail
        await delay(20000);

        // Launch Shift application
        driver = await launchShiftApp();

        // Ensure sign in section is visible
        const signInButton = await driver.wait(until.elementLocated(By.xpath(signInLocators.locators.SIGN_IN_XPATH)), 20000);

        // Check terms of use only if unchecked
        const termsOfUseCheckbox = await driver.findElement(By.xpath(signInLocators.locators.TERMS_OF_USE_CHECKBOX_XPATH));
        const isTermsOfUseCheckboxChecked = await termsOfUseCheckbox.getAttribute('Toggle.ToggleState') === '1';

        if (!isTermsOfUseCheckboxChecked) {
            await termsOfUseCheckbox.click();
        }

        // Uncheck streamline setup only if checked
        const streamlineSetupCheckbox = await driver.findElement(By.xpath(signInLocators.locators.STREAMLINE_SETUP_CHECKBOX_XPATH));
        const isStreamlineSetupCheckboxChecked = await streamlineSetupCheckbox.getAttribute('Toggle.ToggleState') === '1';

        if (isStreamlineSetupCheckboxChecked) {
            await streamlineSetupCheckbox.click();
        }

        // Proceed with 'Sign in with google'
        await signInButton.click();

        // Ensure locale is set to English before proceeding with entering email
        const localeComboBox = await driver.wait(until.elementLocated(By.xpath(signInLocators.locators.LOCALE_COMBO_BOX_XPATH)), 10000);
        await localeComboBox.click();
        const englishOption = await driver.wait(until.elementLocated(By.xpath(signInLocators.locators.ENGLISH_US_LOCALE_OPTION_XPATH)), 5000);
        await englishOption.click();

        // Ensure email input field is visible
        const emailInputField = await driver.wait(until.elementLocated(By.xpath(signInLocators.locators.EMAIL_INPUT_XPATH)), 10000);

        // Type in the email and press ENTER key
        await emailInputField.sendKeys(userProfile.firstUser.email);
        await emailInputField.sendKeys(Key.ENTER);

        // Ensure password input field is visible
        const passwordInputField = await driver.wait(until.elementLocated(By.xpath(signInLocators.locators.PASSWORD_INPUT_XPATH)), 10000);

        // Type in the password and press ENTER key
        await passwordInputField.sendKeys(userProfile.firstUser.password);
        await passwordInputField.sendKeys(Key.ENTER);

        // Click 'Continue' to allow Google to share name, email address etc with Shift
        const continueButton = await driver.wait(until.elementLocated(By.xpath(signInLocators.locators.CONTINUE_BUTTON_XPATH)), 10000);
        await continueButton.click();

        // Click 'Allow' to trust Shift with regards to viewing email messages etc
        const allowButton = await driver.wait(until.elementLocated(By.xpath(signInLocators.locators.ALLOW_BUTTON_XPATH)), 10000);
        await allowButton.click();
        
        // To verify login, we verify that the user avatar button (top-right) is visible
        const avatarButton = await driver.wait(until.elementLocated(By.xpath(messagesLocators.locators.FIRST_AVATAR_XPATH)), 10000);
        expect(avatarButton).to.not.be.null;

        // Confirm that unreal email messages are atleast 3 (based on the number that appears besides the 'Inbox' label)
        const inboxDocumentXpath = await driver.findElement(By.xpath(messagesLocators.locators.INBOX_DOCUMENT_XPATH));
        const nameAttribute = await inboxDocumentXpath.getAttribute(messagesLocators.labels.NAME_ATTRIBUTE);
        const unreadMessageCount = parseInt(nameAttribute.match(constants.UNREAD_COUNT_REGEX)[0]); // Extract digits as integer
        expect(unreadMessageCount).to.be.greaterThanOrEqual(constants.UNREAD_COUNT_MIN);
    });

    
    it('Add workspace for second user and verify unread message count for second user', async function () {
        // Need expect for assertions
        const { expect } = await import('chai');

        // Click on the '+' to add workspace for the second user
        addToShiftButton = await driver.findElement(By.xpath(messagesLocators.locators.ADD_TO_SHIFT_XPATH));
        await addToShiftButton.click();
        const addWorkspaceButton = await driver.findElement(By.xpath(messagesLocators.locators.ADD_WORKSPACE_XPATH));
        await addWorkspaceButton.click();

        // Enter email for new workspace
        const secondUserEmailInputField = await driver.wait(until.elementLocated(By.xpath(messagesLocators.locators.ADD_WORKSPACE_EMAIL_XPATH)), 5000);
        await secondUserEmailInputField.sendKeys(userProfile.secondUser.email);

        // Create Workspace
        const createWorkspaceButton = await driver.findElement(By.xpath(messagesLocators.locators.CREATE_WORKSPACE_XPATH));
        await createWorkspaceButton.click();

        // Locate the modal
        const modal = await driver.wait(until.elementLocated(By.xpath(signInLocators.locators.MODAL_XPATH)), 30000);
        expect(modal).not.to.be.null;

        // Since second user's email is pre-filled, just click the input and press ENTER to continue
        const secondEmailInputField = await modal.findElement(By.xpath(signInLocators.locators.EMAIL_INPUT_XPATH));
        await secondEmailInputField.click();
        await secondEmailInputField.sendKeys(Key.ENTER);

        // Type in the password for second user and press ENTER key
        const secondPasswordInputField = await driver.wait(until.elementLocated(By.xpath(signInLocators.locators.PASSWORD_INPUT_XPATH)), 10000);
        await secondPasswordInputField.sendKeys(userProfile.secondUser.password);
        await secondPasswordInputField.sendKeys(Key.ENTER);

        // Click 'Continue' to allow Google to share second user's name, email address etc with Shift
        const secondContinueButton = await driver.wait(until.elementLocated(By.xpath(signInLocators.locators.CONTINUE_BUTTON_XPATH)), 10000);
        await secondContinueButton.click();

        // Click 'Allow' to trust Shift with regards to viewing second user's email messages etc
        const secondAllowButton = await driver.wait(until.elementLocated(By.xpath(signInLocators.locators.ALLOW_BUTTON_XPATH)), 10000);
        await secondAllowButton.click();

        // Dismiss the 'Welcome to your Workspace'
        const firstUserAvatar = await driver.findElement(By.xpath(messagesLocators.locators.FIRST_LEFT_USER_XPATH));
        await firstUserAvatar.click();
        const secondUserAvatar = await driver.findElement(By.xpath(messagesLocators.locators.SECOND_LEFT_USER_XPATH));
        await secondUserAvatar.click();

        // To verify that second user is logged in, we verify that the second user's avatar button (top-right) is visible
        const secondAvatarButton = await driver.findElement(By.xpath(messagesLocators.locators.SECOND_AVATAR_XPATH));
        expect(secondAvatarButton).not.to.be.null;

        // Confirm that unreal email messages are atleast 3 (based on the number that appears besides the 'Inbox' label)
        const secondInboxDocumentXpath = await driver.findElement(By.xpath(messagesLocators.locators.INBOX_DOCUMENT_XPATH));
        const secondNameAttribute = await secondInboxDocumentXpath.getAttribute(messagesLocators.labels.NAME_ATTRIBUTE);
        const secondUnreadMessageCount = parseInt(secondNameAttribute.match(constants.UNREAD_COUNT_REGEX)[0]); // Extract digits as integer
        expect(secondUnreadMessageCount).to.greaterThanOrEqual(constants.UNREAD_COUNT_MIN);
    });

    it('Add messenger application for second user and verify messenger log in', async function () {
        // Need expect for assertions
        const { expect } = await import('chai');
        
        // Add application
        await addToShiftButton.click();
        const addApplicationButton = await driver.findElement(By.xpath(messagesLocators.locators.ADD_APPLICATION_XPATH));
        await addApplicationButton.click();

        // Click 'All'
        const allOption = await driver.wait(until.elementLocated(By.xpath(appsDirectoryLocators.locators.ALL_APPS_OPTION_XPATH)), 20000);
        await allOption.click();

        // Search for 'Messenger'
        const search = await driver.findElement(By.xpath(appsDirectoryLocators.locators.APP_SEARCH_INPUT_XPATH));
        await search.click();
        await search.sendKeys(appsDirectoryLocators.labels.MESSENGER_LABEL);

        // Click messenger app
        const messenger = await driver.wait(until.elementLocated(By.xpath(appsDirectoryLocators.locators.MESSENGER_APP_XPATH)), 20000);
        await messenger.click();

        // Save changes
        const saveButton = await driver.wait(until.elementLocated(By.xpath(appsDirectoryLocators.locators.SAVE_APPLICATION_XPATH)), 20000);
        await saveButton.click();

        // Enter email
        const applicationEmailInput = await driver.wait(until.elementLocated(By.xpath(messengerLocators.locators.APPLICATION_EMAIL_XPATH)), 10000);
        await applicationEmailInput.click();
        await applicationEmailInput.sendKeys(userProfile.secondUser.email);

        // Enter password
        const applicationPasswordInput = await driver.wait(until.elementLocated(By.xpath(messengerLocators.locators.APPLICATION_PASSWORD_XPATH)), 10000);
        await applicationPasswordInput.click();
        await applicationPasswordInput.sendKeys(userProfile.secondUser.password);

        // Log in
        const applicationLogInButton = await driver.findElement(By.xpath(messengerLocators.locators.LOG_IN_XPATH));
        await applicationLogInButton.click();

        // Verify log in by chat table visibility, no messages and no chats selected text
        const chatTable = await driver.wait(until.elementLocated(By.xpath(messengerLocators.locators.CHAT_TABLE_XPATH)), 30000);
        expect(chatTable).not.to.be.null;

        // Verify no messages as this is an empty account
        const noMessagesText = await driver.findElement(By.xpath(messengerLocators.locators.NO_MESSAGES_XPATH));
        expect(noMessagesText).not.to.be.null;

        // Verify no chats selected as this is an empty account
        const noChatsSelectedText = await driver.findElement(By.xpath(messengerLocators.locators.NO_CHATS_SELECTED_XPATH));
        expect(noChatsSelectedText).not.to.be.null;
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
        if (browser) {
            await browser.close();
        }
    });
});