const fs = require("fs");
const path = require("path");
const { loadConfig } = require("./configLoader");
const { countFiles } = require("./fileCounter");
const { countLines } = require("./lineCounter");
const { formatOutput } = require("./outputFormatter");

async function main() {
  const args = process.argv.slice(2);
  const dirPath = args[0];
  const languages = args[1] ? args[1].split(",") : undefined;

  const config = await loadConfig();
  const files = await countFiles(dirPath, config, languages);
  const results = await countLines(files, config);
  const output = formatOutput(results);

  console.log(output);
}

main().catch(console.error);
