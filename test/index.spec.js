const path = require("path");
const marsSurfaceApp = require("../src/lib");

describe("Move Robots over Mars Surface", () => {
    describe("Given a plain text with information about Mars surface and Robot postion and moves to scan the surface", () => {
        const parsedData = marsSurfaceApp.parseFromFile(
            path.resolve("./data/instructions.txt")
        );
        const map = marsSurfaceApp.createMapFromBounds(parsedData.mars.bounds);
        const mountedRobots = marsSurfaceApp.createRobots(parsedData.robots);

        it("obtain Mars and Roots info", () => {
            expect(parsedData.mars.bounds).toStrictEqual({ x: 5, y: 3 });
            expect(parsedData.robots.length).toBe(3);
        });

        it("Create Map of Mars surface from bounds", () => {
            expect(map.surface.length).toBe(4);
            expect(map.surface[0].length).toBe(6);
            expect(
                map.surface.every(row => row.length === map.surface[0].length)
            ).toBe(true);
        });

        it("Given a Mars surface bounds and robots to walk then robots dicovers Mars surface", () => {
            const result = marsSurfaceApp.scan(map, mountedRobots);
            expect(result).toStrictEqual(["1 1 E", "3 3 N LOST", "2 3 S"]);
        });
    });
});