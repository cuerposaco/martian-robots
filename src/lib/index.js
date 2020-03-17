const fs = require("fs");
const { create: createRobot } = require("../robot");

const MAX_MOVES_CHARS = 100; // max value (not included)
const MAX_COORDINATE_VALUE = 50; // max value (included)

const isValidMovesMaxChars = moves => moves.length < MAX_MOVES_CHARS;
const isValidMovesCommands = moves =>
    moves.split("").every(c => ["R", "F", "L"].includes(c));
const isValidMaxBounds = (...coords) =>
    coords.every(coord => coord <= MAX_COORDINATE_VALUE);

/**
 * Extract info from file
 * @param {File} path file path
 * @param {Object} options native fs.readFileSync() options
 */
const parseFromFile = (path, ...options) => {
    const txt = fs.readFileSync(path, "utf8", ...options);
    return parse(txt);
};

/**
 * Robots generator
 * @param {String} robotLines
 * @returns {Array} [ [postion, moves], [postion, moves], ... ]
 *
 * Obtain Robot's position and moves
 * Group instruction lines by 2
 * until the end of instuctions text
 */
function* extractRobotGenerator(instructions) {
    const lines = instructions.slice();
    while (lines.length) {
        const [position, moves] = lines.splice(0, 2);
        if (!isValidMovesCommands(moves)) {
            throw new Error("Only [R,L,F] moves are valid");
        }
        if (!isValidMovesMaxChars(moves)) {
            throw new Error("Moves must be less than 100");
        }
        yield [position, moves];
    }
    return;
}

/* Transform instructions raw text into Data */
const parse = plainText => {
    const clearText = text =>
        text
        .replace(/ +/, " ") // convert all multispaces to space
        .replace(/^ /, "") // remove space from start
        .replace(/ $/, ""); // and end

    const LINE_DELIMITER = "\n";

    const [marsLines, ...robotLines] = clearText(plainText)
        .split(LINE_DELIMITER)
        .map(clearText)
        .filter(line => !!line);

    const [x, y] = marsLines.split(" ").map(coord => Number(coord));
    const mars = { bounds: { x, y } };

    // Validate enter bounds
    if (!isValidMaxBounds(x, y)) {
        throw new Error("Max value allowed in coordinates is 50 or less");
    }

    const robotCollection = extractRobotGenerator(robotLines);
    const robots = [...robotCollection];

    return (data = {
        mars,
        robots
    });
};

/**
 * Create surface from bounds
 * @param {Object} bounds {x,y} Surface coordinates
 * @returns {Object<{ scents, surface }>} **scents** is a robot comunication layer **surface** a bidimensional array
 */
const createMapFromBounds = bounds => {
    const SURFACE = "0";

    /**
     * Create Bidimensional Array
     * @param {Object} x surface coord
     * @param {Object} y surface coord
     * @returns {Array} bidimensional array `[ y[ x[] ] ]`
     */
    const create = ({ x, y }) =>
        Array(y + 1)
        .fill("")
        .map(_ =>
            Array(x + 1)
            .fill("")
            .map(_ => SURFACE)
        );

    // robot comunication layer
    const scents = [];
    // Bidimensional void surface
    const surface = create({...bounds });

    return {
        scents,
        surface
    };
};

/**
 * Mount
 */
const createRobots = robots => {
    const mountedRobots = robots.map(([position, moves]) =>
        createRobot(position, moves)
    );

    return mountedRobots;
};

/**
 * Put robots to walk on Mars surface
 * @param {Object<{ scents, surface }>} map bidimensional surface and robot comunication layer
 * */
const scan = (map, robots) => {
    return robots.map(robot => robot.walk(map));
};

module.exports = {
    parse,
    parseFromFile,
    createMapFromBounds,
    createRobots,
    scan
};