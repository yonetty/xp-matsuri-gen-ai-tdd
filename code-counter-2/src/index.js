const { getFilesByLanguage } = require("./fileCounter");
const { countLinesForLanguage } = require("./lineCounter");
const { formatOutput } = require("./outputFormatter");

function main() {
  const args = process.argv.slice(2);
  const dirPath = args[0];
  const languages = args[1] ? args[1].split(",") : null;

  if (!dirPath) {
    console.error("ディレクトリパスを指定してください。");
    process.exit(1);
  }

  const filesByLanguage = getFilesByLanguage(dirPath, languages);
  const results = {};

  for (const [language, files] of Object.entries(filesByLanguage)) {
    results[language] = countLinesForLanguage(files, language);
  }

  const output = formatOutput(results);
  console.log(output);
}

main();
