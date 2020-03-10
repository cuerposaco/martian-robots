const marsSurfaceApp = require("../src");

describe("Move Robots over Mars Surface", () => {
    describe("Given a plain text with information about Mars surface and Robot postion and moves to scan the surface", () => {
        it("obtain Mars and Roots info", () => {
            const parsedData = marsSurfaceApp.parse("");
            expect(parsedData.mars.bounds).toBe({ x: 0, y: 0 });
            expect(parsedData.robots).toBe([]);
        });

        it("Create Map of Mars surface from bounds", () => {
            const parsedData = marsSurfaceApp.parse("");
            const map = marsSurfaceApp.createMapFromBounds(parsedData.mars.bounds);
            expect(map).toBe([
                []
            ]);
        });

        it("Given a Mars surface bounds and robots to walk then robots dicovers Mars surface", () => {
            const parsedData = marsSurfaceApp.parse("");
            const result = marsSurfaceApp.scan(map, parsedData.robots);
            expect(result).toBe("");
        });
    });
});