const fs = require("fs").promises;

async function countLines(files, config) {
  const result = {};

  for (const file of files) {
    const { path, language } = file;
    const languageConfig = config.languages[language];

    if (!result[language]) {
      result[language] = { files: 0, code: 0, comment: 0, blank: 0, total: 0 };
    }

    try {
      const content = await fs.readFile(path, "utf-8");
      const lines = content.split("\n");

      result[language].files += 1;

      // 空のファイルの場合は、すべての値を0にする
      if (lines.length === 1 && lines[0] === "") {
        result[language].total += 0;
      } else {
        result[language].total += lines.length;

        for (const line of lines) {
          const trimmedLine = line.trim();

          if (trimmedLine === "") {
            result[language].blank += 1;
          } else if (
            isCommentLine(trimmedLine, languageConfig.comment_patterns)
          ) {
            result[language].comment += 1;
          } else {
            result[language].code += 1;
          }
        }
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        throw new Error(`ファイルが見つかりません: ${path}`);
      }
      throw error;
    }
  }

  return result;
}

function isCommentLine(line, commentPatterns) {
  return commentPatterns.some((pattern) => pattern.test(line));
}

module.exports = { countLines };
