const { exec } = require('child_process');
const { VERSION_MATCH_REGEX } = require('../config/constants');

const installApplication = (installerPath, installedPath) => {
    const command = `"${installerPath}" /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /DIR="${installedPath}"`;
    try {
        exec(command);
        // console.log('Installation completed');
    } catch (error) {
        console.error('Installation error:', error);
        throw new Error(`Failed to install Shift application`);
    }
}

const getFileVersion = (installedPath) => {
    return new Promise((resolve, reject) => {
        const command = `wmic datafile where name="${installedPath.replace(/\\/g, '\\\\')}" get Version`;
        // Execute the wmic command to get the version
        exec(command, (error, stdout) => {
            if (error) {
                console.error('Error occurred:', error);
                reject('Failed to retrieve version');
            } else {
                // Extract version from the output
                const versionMatch = stdout.match(VERSION_MATCH_REGEX)[0];
                if (versionMatch && versionMatch.length > 0) {
                    resolve(versionMatch);
                } else {
                    console.error('Version not found in output:', stdout);
                    reject('Version not found');
                }
            }
        });
    });
}

const deleteFile = (filePath) => {
    const command = `del "${filePath}"`;
    try {
        exec(command);
        // console.log(`Following file has been deleted successfully: ${filePath}`);
    } catch (error) {
      console.error('Error executing command:', error);
      throw new Error(`Failed to delete file from the following filepath: ${filePath}`);
    }
}

module.exports = {
    installApplication,
    getFileVersion,
    deleteFile,
};