function formatOutput(results) {
  const headers = [
    "Language",
    "Files",
    "Code Lines",
    "Comment Lines",
    "Blank Lines",
    "Total Lines",
  ];
  const rows = [];

  let totalFiles = 0;
  let totalCode = 0;
  let totalComment = 0;
  let totalBlank = 0;

  for (const [lang, counts] of Object.entries(results)) {
    const total = counts.code + counts.comment + counts.blank;
    rows.push([
      lang,
      counts.files.toString(),
      counts.code.toString(),
      counts.comment.toString(),
      counts.blank.toString(),
      total.toString(),
    ]);

    totalFiles += counts.files;
    totalCode += counts.code;
    totalComment += counts.comment;
    totalBlank += counts.blank;
  }

  const totalTotal = totalCode + totalComment + totalBlank;
  rows.push([
    "Total",
    totalFiles.toString(),
    totalCode.toString(),
    totalComment.toString(),
    totalBlank.toString(),
    totalTotal.toString(),
  ]);

  const columnWidths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => r[i].length))
  );

  const formatRow = (row) =>
    "| " +
    row.map((cell, i) => cell.padEnd(columnWidths[i])).join(" | ") +
    " |";

  const separator =
    "|" + columnWidths.map((w) => "-".repeat(w + 2)).join("|") + "|";

  return [formatRow(headers), separator, ...rows.map(formatRow)].join("\n");
}

module.exports = { formatOutput };
