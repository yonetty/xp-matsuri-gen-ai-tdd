function generateReport(data) {
  const header =
    "| Language   | Files | Code Lines | Comment Lines | Blank Lines | Total Lines |";
  const separator =
    "|------------|-------|------------|---------------|-------------|-------------|";

  let rows = [];
  let totalFiles = 0;
  let totalCode = 0;
  let totalComment = 0;
  let totalBlank = 0;
  let totalLines = 0;

  for (const [language, stats] of Object.entries(data)) {
    rows.push(
      `| ${language.padEnd(10)} | ${stats.files
        .toString()
        .padEnd(5)} | ${stats.code.toString().padEnd(10)} | ${stats.comment
        .toString()
        .padEnd(13)} | ${stats.blank.toString().padEnd(11)} | ${stats.total
        .toString()
        .padEnd(11)} |`
    );

    totalFiles += stats.files;
    totalCode += stats.code;
    totalComment += stats.comment;
    totalBlank += stats.blank;
    totalLines += stats.total;
  }

  rows.sort((a, b) => a.localeCompare(b));

  const totalRow = `| Total      | ${totalFiles
    .toString()
    .padEnd(5)} | ${totalCode.toString().padEnd(10)} | ${totalComment
    .toString()
    .padEnd(13)} | ${totalBlank.toString().padEnd(11)} | ${totalLines
    .toString()
    .padEnd(11)} |`;

  return [header, separator, ...rows, totalRow].join("\n");
}

module.exports = { generateReport };
