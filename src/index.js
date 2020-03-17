const app = require("./lib");

/**
 * Execute commands from file
 * @param {File} filePath the system path when commands file is located
 * @returns {String} executed commands response
 */
const runFromFile = filePath => {
    // parse data from file
    const {
        mars: { bounds },
        robots
    } = app.parseFromFile(filePath);

    // create Mars surface
    const map = app.createMapFromBounds(bounds);
    const mountedRobots = app.createRobots(robots);
    // scans Mars surface with the robots
    return app.scan(map, mountedRobots).join("\n");
};

/**
 * Execute commands from file
 * @param {String} rawText commands provided by raw text
 * @returns {String} executed commands response
 */
const runFromText = rawText => {
    const {
        mars: { bounds },
        robots
    } = app.parse(rawText);
    const map = app.createMapFromBounds(bounds);
    const mountedRobots = app.createRobots(robots);
    return app.scan(map, mountedRobots).join("\n");
};

module.exports = {
    runFromFile,
    runFromText
};