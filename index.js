const path = require("path");
const { runFromFile, runFromText } = require("./src");

const instructionsFilePath = path.resolve("./data/instructions.txt");
const result = runFromFile(instructionsFilePath);

console.log(result);