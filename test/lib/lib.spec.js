const { createMapFromBounds, parse } = require("../../src/lib");

describe("LIB test", () => {
    describe("createMapFromBounds", () => {
        it("Should create map bounds OK", () => {
            expect(createMapFromBounds({ x: 1, y: 1 }).surface).toStrictEqual([
                ["0", "0"],
                ["0", "0"]
            ]);
        });
        it("Should fail when any coordinate is greater than max coordinate value", () => {
            try {
                parse(`
            51 3
            1 1 E
            RFRFRFRF
          `);
            } catch (error) {
                expect(error.message).toBe(
                    "Max value allowed in coordinates is 50 or less"
                );
            }
            try {
                parse(`
            5 90
            1 1 E
            RFRFRFRF
          `);
            } catch (error) {
                expect(error.message).toBe(
                    "Max value allowed in coordinates is 50 or less"
                );
            }
        });
        it("Should fail when robots moves is greater than max moves allowed", () => {
            try {
                parse(`
            1 3
            1 1 E
            RFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRF
          `);
            } catch (error) {
                expect(error.message).toBe("Moves must be 100 characters or less");
            }
        });
    });
});