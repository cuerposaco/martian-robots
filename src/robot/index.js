const { COMMAND_KEY, COMPASS, ORIENTATION_KEY } = require("./constants");

const cardinalsLength = COMPASS.length;
const { L, R, F } = COMMAND_KEY;

/**
 * Commands State
 */
const commandFn = {
    [L]: state => ({...state, orientation: rotateLeft(state.orientation) }),
    [R]: state => ({...state, orientation: rotateRight(state.orientation) }),
    [F]: (state, map) => ({...state, ...moveForward(state, map) })
};

/**
 * Get Cardinal index from index 0:N 1:E 2:S 3:W
 * @param {String} currentCardinal N,E,S,W
 * @returns {Number} 0,1,2,3
 */
const getIndexFromCardinal = currentCardinal =>
    COMPASS.findIndex(cardinal => cardinal === currentCardinal);

/**
 * Get Cardinal orientation from index number
 * @param {Number} index cardinal index 0,1,2,3
 * @returns {String} N,E,S,W
 */
const getCardinalFromIndex = index => COMPASS[index];

/**
 * Rotate Left Command
 * @param {String} current current Cardinal orientation
 * @returns {String} new cardinal orientation
 */
const rotateLeft = current => {
    const currentIndex = getIndexFromCardinal(current) || cardinalsLength;
    const newIndex = (currentIndex - 1) % cardinalsLength;
    return getCardinalFromIndex(newIndex);
};

/**
 * Rotate Right Command
 * @param {String} current current Cardinal orientation
 * @returns {String} new cardinal orientation
 */
const rotateRight = current => {
    const currentIndex = getIndexFromCardinal(current);
    const newIndex = (currentIndex + 1) % cardinalsLength;
    return getCardinalFromIndex(newIndex);
};

/**
 * Move Forward comamand
 * @param {Object} state current robot state
 * @param {Object} map planet information
 * @returns {Object} new robot state
 */
const moveForward = (state, { surface, scents }) => {
    const nextMove = ({ x, y, orientation }) => {
        const { N, E, S, W } = ORIENTATION_KEY;
        const move = {
            [N]: (x, y) => [x, y + 1],
            [E]: (x, y) => [x + 1, y],
            [S]: (x, y) => [x, y - 1],
            [W]: (x, y) => [x - 1, y]
        };
        const [_x, _y] = move[orientation](x, y);
        return { x: _x, y: _y };
    };
    const isOff = surface => typeof surface === typeof undefined;
    const isLost = ({ x, y }) =>
        scents.some(
            scent => scent.type === "LOST" && scent.x === x && scent.y === y
        );

    const rows = surface.length - 1;
    const newPos = nextMove({...state });
    const newSurface =
        surface[rows - newPos.y] && surface[rows - newPos.y][newPos.x];

    if (isLost(newPos)) {
        return {...state };
    }
    if (isOff(newSurface)) {
        scents.push({ type: "LOST", ...newPos });
        return {...state, lost: true };
    }
    return {...state, ...newPos };
};

/**
 * Mount Robot
 * @param {Array} position [x, y, orientation]
 * @param {String} moves LLRFLRF...
 * @return {Object} walk(map) Run instruction to walk the planet surface
 *
 * `create([1,1,S], 'LRRLFFFFLR').walk(<mapObject>)`
 */
const create = (position, moves) => {
    const [x, y, orientation] = position.split(" ");
    const currentState = { x: Number(x), y: Number(y), orientation, lost: false };

    const walk = map => {
        const movesCollection = moves.split("");
        const result = movesCollection.reduce(
            (state, command) =>
            (state.lost && state) || commandFn[command](state, map),
            currentState
        );

        return [result.x, result.y, result.orientation, result.lost && "LOST"]
            .filter(s => !!s)
            .join(" ");
    };

    const getState = () => currentState;

    return {
        walk,
        getState
    };
};

module.exports = {
    create,
    getIndexFromCardinal,
    getCardinalFromIndex,
    rotateLeft,
    rotateRight,
    moveForward
};