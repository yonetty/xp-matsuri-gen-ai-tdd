function formatOutput(results) {
  let output =
    "| Language   | Files | Code Lines | Comment Lines | Blank Lines | Total Lines |\n";
  output +=
    "|------------|-------|------------|---------------|-------------|-------------|\n";

  let totalFiles = 0;
  let totalCodeLines = 0;
  let totalCommentLines = 0;
  let totalBlankLines = 0;
  let grandTotalLines = 0;

  for (const [language, result] of Object.entries(results)) {
    output += `| ${language.padEnd(10)} | ${result.files
      .toString()
      .padEnd(5)} | ${result.codeLines
      .toString()
      .padEnd(10)} | ${result.commentLines
      .toString()
      .padEnd(13)} | ${result.blankLines
      .toString()
      .padEnd(11)} | ${result.totalLines.toString().padEnd(11)} |\n`;

    totalFiles += result.files;
    totalCodeLines += result.codeLines;
    totalCommentLines += result.commentLines;
    totalBlankLines += result.blankLines;
    grandTotalLines += result.totalLines;
  }

  output += `| ${"Total".padEnd(10)} | ${totalFiles
    .toString()
    .padEnd(5)} | ${totalCodeLines.toString().padEnd(10)} | ${totalCommentLines
    .toString()
    .padEnd(13)} | ${totalBlankLines.toString().padEnd(11)} | ${grandTotalLines
    .toString()
    .padEnd(11)} |\n`;

  return output;
}

module.exports = { formatOutput };
