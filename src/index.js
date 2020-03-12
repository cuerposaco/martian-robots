const marsSurfaceApp = require("./lib");

const runFromFile = filePath => {
    const {
        mars: { bounds },
        robots
    } = marsSurfaceApp.parseFromFile(filePath);
    const map = marsSurfaceApp.createMapFromBounds(bounds);
    return marsSurfaceApp.scan(map, robots).join("\n");
};

const runFromText = rawText => {
    const {
        mars: { bounds },
        robots
    } = marsSurfaceApp.parse(rawText);
    const map = marsSurfaceApp.createMapFromBounds(bounds);
    return marsSurfaceApp.scan(map, robots).join("\n");
};

module.exports = {
    runFromFile,
    runFromText
};