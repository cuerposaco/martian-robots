const fs = require("fs");
const { create: createRobot } = require("../robot");

const MAX_MOVES_CHARS = 100;
const MAX_COORDINATE_VALUE = 50;

const isValidMovesMaxChars = moves => moves.length < MAX_MOVES_CHARS;
const isValidMaxBounds = (...coords) =>
    coords.every(coord => coord < MAX_COORDINATE_VALUE);

/**
 * Robots generator
 * @param {String} robotLines
 * @returns {Array} [ [postion, moves], [postion, moves], ... ]
 *
 * Obtain Robot's position and moves
 * Group instruction lines by 2
 * until the end of instuctions text
 * */
function* extractRobotGenerator(instructions) {
    // get a copy of instructions
    const lines = instructions.slice();

    while (lines.length) {
        // extract first 2 lines of
        const [position, moves] = lines.splice(0, 2);
        if (!isValidMovesMaxChars(moves)) {
            throw new Error("Moves must be 100 characters or less");
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
    if (!isValidMaxBounds(x, y)) {
        throw new Error("Max value allowed in coordinates is 50 or less");
    }

    const generator = extractRobotGenerator(robotLines);
    const robots = [...generator];

    /* if (!robots.every(([_, moves]) => isValidMovesMaxChars(moves))) {
            throw new Error("Moves must be 100 characters or less");
        } */

    return (data = {
        mars: {
            bounds: { x, y }
        },
        robots
    });
};

const parseFromFile = (path, ...options) => {
    const txt = fs.readFileSync(path, "utf8", ...options);
    return parse(txt);
};

/* Create a Map from bounds */
const createMapFromBounds = bounds => {
    const SURFACE = "0";

    const create = ({ x, y }) =>
        Array(y + 1)
        .fill("")
        .map(_ =>
            Array(x + 1)
            .fill("")
            .map(_ => SURFACE)
        );

    return {
        scents: [],
        surface: create({...bounds })
    };
};

/* Scans Mars surface from walking robots */
const scan = (map, robots) => {
    const mountedRobots = robots.map(([position, moves]) =>
        createRobot(position, moves)
    );
    return mountedRobots.map(robot => robot.walk(map));
};

module.exports = {
    parse,
    parseFromFile,
    createMapFromBounds,
    scan
};