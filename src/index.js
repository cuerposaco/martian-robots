/* Transform instructions raw text into Data */
export const parse = plainText => ({
    mars: {
        bounds: { x: 0, y: 0 }
    },
    robots: []
});

/* Create a Map from bounds */
export const createMapFromBounds = bounds => {
    return [
        []
    ];
};

/* Scans Mars surface from walking robots */
export const scan = (map, robots) => {
    map.createLayer("info");
    const mountedRobots = robots.map(robot => robot.create(robot));
    mountedRobots.map(robot => {
        robot.walk(map);
    });
    map.addRobot(mountedRobots);

    return "";
};