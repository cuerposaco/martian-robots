const { createMapFromBounds } = require("../../src/lib");
const {
    getIndexFromCardinal,
    getCardinalFromIndex,
    rotateLeft,
    rotateRight,
    moveForward,
    create
} = require("../../src/robot");

describe("ROBOT Test", () => {
    describe("getIndexFromCardinal", () => {
        it("Should cardinal NESW be OK", () => {
            expect(getIndexFromCardinal("N")).toBe(0);
            expect(getIndexFromCardinal("E")).toBe(1);
            expect(getIndexFromCardinal("S")).toBe(2);
            expect(getIndexFromCardinal("W")).toBe(3);
        });
    });
    describe("getCardinalFromIndex", () => {
        it("Should index number is cardinal string", () => {
            expect(getCardinalFromIndex(0)).toBe("N");
            expect(getCardinalFromIndex(1)).toBe("E");
            expect(getCardinalFromIndex(2)).toBe("S");
            expect(getCardinalFromIndex(3)).toBe("W");
        });
    });
    describe("rotateLeft", () => {
        it("Should rotate to previous cardinal position", () => {
            expect(rotateLeft("N")).toBe("W");
            expect(rotateLeft("W")).toBe("S");
            expect(rotateLeft("S")).toBe("E");
            expect(rotateLeft("E")).toBe("N");
        });
    });
    describe("rotateRight", () => {
        it("Should rotate to next cardinal position", () => {
            expect(rotateRight("N")).toBe("E");
            expect(rotateRight("E")).toBe("S");
            expect(rotateRight("S")).toBe("W");
            expect(rotateRight("W")).toBe("N");
        });
    });
    describe("moveForward", () => {
        it("Should move to next position", () => {
            const map = createMapFromBounds({ x: 1, y: 1 });
            expect(
                moveForward({ x: 0, y: 0, orientation: "N", lost: false }, map)
            ).toStrictEqual({
                x: 0,
                y: 1,
                orientation: "N",
                lost: false
            });
        });

        it("Should left LOST scent when robot walks off the planet surface", () => {
            const map = createMapFromBounds({ x: 1, y: 1 });
            expect(
                moveForward({ x: 1, y: 1, orientation: "N", lost: false }, map)
            ).toStrictEqual({
                x: 1,
                y: 1,
                orientation: "N",
                lost: true
            });
            expect(map.scents.length).toBe(1);
            expect(map.scents[0]).toStrictEqual({
                type: "LOST",
                x: 1,
                y: 2
            });
        });

        it("Should read LOST scent when robot walks off the planet surface", () => {
            const map = createMapFromBounds({ x: 1, y: 1 });
            moveForward({ x: 1, y: 1, orientation: "N", lost: false }, map);
            expect(
                moveForward({ x: 1, y: 1, orientation: "N", lost: false }, map)
            ).toStrictEqual({
                x: 1,
                y: 1,
                orientation: "N",
                lost: false
            });
        });
    });
    describe("create", () => {
        it("Should create Robot object", () => {
            let robot = create("0 0 W", "FFFLFLFFFRFRFFF");
            expect(robot.walk).toBeInstanceOf(Function);
            expect(robot.getState()).toStrictEqual({
                x: 0,
                y: 0,
                orientation: "W",
                lost: false
            });
            robot = create("5 2 S", "FFFLFLFFFRFRFFF");
            expect(robot.getState()).toStrictEqual({
                x: 5,
                y: 2,
                orientation: "S",
                lost: false
            });
        });

        it("Should throw error when any coordinate is greater than max coordinate value", () => {
            let robot = create("51 0 W", "FFFLFLFFFRFRFFF");
            const map = createMapFromBounds({ x: 1, y: 1 });
            try {
                robot.walk(map);
            } catch (error) {
                expect(error.message).toBe(
                    "Max value allowed in coordinates is 50 or less"
                );
            }
        });
    });
});