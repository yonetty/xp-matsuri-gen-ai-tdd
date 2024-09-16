const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

function loadConfig() {
  const configPath = path.join(__dirname, "..", "config.yml");
  const config = yaml.load(fs.readFileSync(configPath, "utf8"));
  return config;
}

function countLines(filePath, language) {
  const config = loadConfig();
  const langConfig = config.languages.find((lang) => lang.name === language);
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  const commentRegex = new RegExp(langConfig.commentRegex);

  let codeLines = 0;
  let commentLines = 0;
  let blankLines = 0;

  for (const line of lines) {
    if (line.trim() === "") {
      blankLines++;
    } else if (commentRegex.test(line)) {
      commentLines++;
    } else {
      codeLines++;
    }
  }

  return {
    codeLines,
    commentLines,
    blankLines,
    totalLines: lines.length,
  };
}

function countLinesForLanguage(files, language) {
  let totalCodeLines = 0;
  let totalCommentLines = 0;
  let totalBlankLines = 0;
  let totalLines = 0;

  for (const file of files) {
    const {
      codeLines,
      commentLines,
      blankLines,
      totalLines: fileTotalLines,
    } = countLines(file, language);
    totalCodeLines += codeLines;
    totalCommentLines += commentLines;
    totalBlankLines += blankLines;
    totalLines += fileTotalLines;
  }

  return {
    files: files.length,
    codeLines: totalCodeLines,
    commentLines: totalCommentLines,
    blankLines: totalBlankLines,
    totalLines,
  };
}

module.exports = { countLinesForLanguage };
