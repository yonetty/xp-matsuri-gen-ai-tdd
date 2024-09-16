const fs = require("fs").promises;

async function countLines(files, config) {
  const results = {};

  for (const file of files) {
    const content = await fs.readFile(file.path, "utf-8");
    const lines = content.split("\n");

    if (!results[file.language]) {
      results[file.language] = { files: 0, code: 0, comment: 0, blank: 0 };
    }

    results[file.language].files++;

    const commentRegex = new RegExp(
      config.languages[file.language].commentPattern
    );

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine === "") {
        results[file.language].blank++;
      } else if (commentRegex.test(trimmedLine)) {
        results[file.language].comment++;
      } else {
        results[file.language].code++;
      }
    }
  }

  return results;
}

module.exports = { countLines };
