const { parseArguments } = require("./argumentParser");
const { readConfig } = require("./configReader");
const { getFileList } = require("./fileListGenerator");
const { countLines } = require("./lineCounter");
const { generateReport } = require("./reportGenerator");

async function main() {
  try {
    const args = parseArguments(process.argv.slice(2));
    const config = await readConfig("./config.yml");
    const fileList = await getFileList(args.directory, args.languages, config);
    const lineCountData = await countLines(fileList, config);
    const report = generateReport(lineCountData);
    console.log(report);
  } catch (error) {
    console.error("エラーが発生しました:", error.message);
    process.exit(1);
  }
}

main();
