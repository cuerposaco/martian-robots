const fs = require("fs");
const { create: createRobot } = require("../robot");

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
    const generator = extractRobotGenerator(robotLines);
    const robots = [...generator];
    const [x, y] = marsLines.split(" ").map(coord => Number(coord));

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