const { createMapFromBounds, parse } = require("../../src/lib");

describe("LIB test", () => {
    describe("parse", () => {
        it.each(["0 0", "50 0", "0 50", "50 50"])(
            "Should pass when %s %s",
            coords => {
                expect(
                    parse(`
            ${coords}
            1 1 E
            RFRFRFRF
          `)
                ).toBeTruthy();
            }
        );
        it.each(["51 0", "0 51", "51 51"])("Should fail when %s %s", coords => {
            expect(() =>
                parse(`
            ${coords}
            1 1 E
            RFRFRFRF
          `)
            ).toThrow(new Error("Max value allowed in coordinates is 50 or less"));
        });
        it.each([
            Array(100)
            .fill("R")
            .map((c, index) => (index % 2 && "F") || c)
            .join(""),
            Array(101)
            .fill("R")
            .map((c, index) => (index % 2 && "F") || c)
            .join("")
        ])("Should fail when robots moves %s", moves => {
            expect(() =>
                parse(`
            1 3
            1 1 E
            ${moves}
          `)
            ).toThrow(new Error("Moves must be less than 100"));
        });
        it.each([
            Array(50)
            .fill("A")
            .map((c, index) => (index % 2 && "F") || c)
            .join(""),
            Array(50)
            .fill("R")
            .map((c, index) => (index % 2 && "L") || c)
            .join()
        ])("Should fail when robots moves %s", moves => {
            expect(() =>
                parse(`
            1 3
            1 1 E
            ${moves}
          `)
            ).toThrow(new Error("Only [R,L,F] moves are valid"));
        });
    });

    describe("createMapFromBounds", () => {
        it("Should create map bounds OK", () => {
            expect(createMapFromBounds({ x: 1, y: 1 }).surface).toStrictEqual([
                ["0", "0"],
                ["0", "0"]
            ]);
        });
    });
});