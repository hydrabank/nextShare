const chalk = require("chalk");

/**
 * @typedef {string} LogChannelType
 */

/**
 * @enum {LogChannelType}
 */
var TYPE_LOGCHANNELS = {
    INFORMATION: "info",
    ERROR: "error",
    EVENT: "event",
    READY: "ready"
};
TYPE_LOGCHANNELS = Object.freeze(TYPE_LOGCHANNELS);

/**
 * 
 * @param {string} output The output to be redirected to STDOUT
 * @param {LogChannelType} channel The channel to which the output should be redirected
 * @returns 
 */
function log(output, channel) {
    const spaceNum = 6;
    if (!channel) channel = "app";

    if (channel === "info") {
        let cutPrefix = "info".substring(0, spaceNum - 1);
        let totalSpaces = " ".repeat(spaceNum - cutPrefix.length);
        return console.log(chalk.cyan(cutPrefix) + totalSpaces + "- " + output);
    } else if (channel === "error") {
        let cutPrefix = "error".substring(0, spaceNum - 1);
        let totalSpaces = " ".repeat(spaceNum - cutPrefix.length);
        return console.log(chalk.red(cutPrefix) + totalSpaces + "- " + output);
    } else if (channel === "event") {
        let cutPrefix = "event".substring(0, spaceNum - 1);
        let totalSpaces = " ".repeat(spaceNum - cutPrefix.length);
        return console.log(chalk.magenta(cutPrefix) + totalSpaces + "- " + output);
    } else if (channel === "ready") {
        let cutPrefix = "ready".substring(0, spaceNum - 1);
        let totalSpaces = " ".repeat(spaceNum - cutPrefix.length);
        return console.log(chalk.green(cutPrefix) + totalSpaces + "- " + output);
    } else if (channel === "create") {
        let cutPrefix = "in".substring(0, spaceNum - 1);
        let totalSpaces = " ".repeat(spaceNum - cutPrefix.length);
        return console.log(chalk.green(cutPrefix) + totalSpaces + "- " + output);
    } else if (channel === "delete") {
        let cutPrefix = "out".substring(0, spaceNum - 1);
        let totalSpaces = " ".repeat(spaceNum - cutPrefix.length);
        return console.log(chalk.red(cutPrefix) + totalSpaces + "- " + output);
    } else {
        console.log(output);
    };
};

module.exports = { log };