const { parseInstructions } = require("./src/instructions");

describe("martian robots", () => {
    const input = `
5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL
`;
    it("Should parseInstructions returns an array of 7 elements", () => {
        expect(parseInstructions(input)).toBe;
    });
    it("Should pass example", () => {
        const result = `
1 1 E
3 3 N LOST
2 3 S
`;
        expect(martians(input)).toBe(result);
    });
});