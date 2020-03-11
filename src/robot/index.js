const { COMMAND_KEY, COMPASS, ORIENTATION_KEY } = require("./constants");
const { L, R, F } = COMMAND_KEY;

const cardinalsLength = COMPASS.length;
const getIndexFromCardinal = currentCardinal => {
    return (
        COMPASS.findIndex(cardinal => cardinal === currentCardinal) ||
        cardinalsLength
    );
};
const getCardinalFromIndex = index => COMPASS[index];

const rotateLeft = current => {
    const currentIndex = getIndexFromCardinal(current);
    const newIndex = (currentIndex - 1) % cardinalsLength;
    return getCardinalFromIndex(newIndex);
};
const rotateRight = current => {
    const currentIndex = getIndexFromCardinal(current);
    const newIndex = (currentIndex + 1) % cardinalsLength;
    return getCardinalFromIndex(newIndex);
};
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

const commandFn = {
    [L]: state => ({...state, orientation: rotateLeft(state.orientation) }),
    [R]: state => ({...state, orientation: rotateRight(state.orientation) }),
    [F]: (state, map) => ({...state, ...moveForward(state, map) })
};

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
        return `${result.x} ${result.y} ${result.orientation}${(result.lost &&
      " LOST") ||
      ""}`;
    };

    return {
        walk
    };
};

module.exports = {
    create
};