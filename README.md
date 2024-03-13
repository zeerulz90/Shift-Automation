# Project Setup (For Windows)

Follow these steps to set up the project environment:

1. **Install WinAppDriver**: Download WinAppDriver from [here](https://github.com/Microsoft/WinAppDriver/releases). Unzip the downloaded file, open it, and run the executable file to start the server. The server is expected to run at http://127.0.0.1:4723/.

2. **Install Node.js**: Ensure that you have the latest version of Node.js installed on your system. You can download and install it from the [official Node.js website](https://nodejs.org/en).

3. **Open IDE**: Open your preferred Integrated Development Environment (IDE) to work on the project. We recommend using Visual Studio Code for its simplicity and extensive features.

4. **Clone the Project**: Open the terminal or command prompt and navigate to the directory where you want to store the project files. Use the **`git clone`** command followed by the URL of the repository to create a local copy of the project.

   ```js
   git clone https://github.com/zeerulz90/Shift-Automation.git
   ```

5. **Install Dependencies**: Once the project is cloned, navigate to its root directory in the terminal and run the following command to install the required dependencies:

   ```js
   npm install
   ```

   This command will download and install all the necessary dependencies
   specified in the **`package.json`** file.

6. **Install Supported Browsers**: Run the following command to install the supported browsers, including Chromium:

   ```js
   npx playwright install
   ```

7. **Run Tests**: Execute the following command to trigger the execution of tests:

   ```js
   npm test
   ```

8. **View Test Reports**: After the tests have been executed successfully, you can find the Mochawesome report inside the 'mochawesome-report' folder located in the project root directory.

# Project Details

This project is developed using the following technologies and libraries:

1. **Programming Language**: JavaScript (Node.js)
2. **Libraries**:
   - **Chai**: Assertion library for writing test assertions
   - **Mocha**: Testing framework for organizing and running tests
   - **Playwright**: Automation library for web applications
   - **Selenium WebDriver**: Automation library for web and desktop applications
3. **Web Automation**: Playwright was utilized for automating web elements.
4. **Desktop Automation**: WinAppDriver and Selenium WebDriver were employed to automate desktop elements and the Shift application.
5. **Test Framework**: Mocha testing framework was utilized to create and execute tests. A total of 5 tests were included in a single test suite.
6. **Assertion Library**: Chai was used as the assertion library for writing test assertions.
7. **Test Reporting**: Mochawesome reporter was integrated to generate comprehensive test reports.
