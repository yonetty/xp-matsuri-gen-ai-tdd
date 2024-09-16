const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// 設定ファイルの読み込み
const config = yaml.load(fs.readFileSync("config.yml", "utf8"));

// コマンドライン引数の解析
const [, , dirPath, languages] = process.argv;
const targetLanguages = languages
  ? languages.split(",")
  : Object.keys(config.languages);

// ファイル数とコード行数をカウントする関数
function countLines(filePath, language) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const stats = { code: 0, comment: 0, blank: 0 };

  const commentPatterns = config.languages[language].comment_patterns.map(
    (pattern) => new RegExp(pattern)
  );

  lines.forEach((line) => {
    if (line.trim() === "") {
      stats.blank++;
    } else if (commentPatterns.some((pattern) => pattern.test(line))) {
      stats.comment++;
    } else {
      stats.code++;
    }
  });

  return stats;
}

// ディレクトリを再帰的に探索する関数
function traverseDirectory(dir, results) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!config.exclude_directories.includes(file)) {
        traverseDirectory(filePath, results);
      }
    } else {
      const ext = path.extname(file);
      const language = Object.keys(config.languages).find(
        (lang) =>
          config.languages[lang].extensions.includes(ext) &&
          targetLanguages.includes(lang)
      );

      if (language) {
        if (!results[language]) {
          results[language] = { files: 0, code: 0, comment: 0, blank: 0 };
        }
        results[language].files++;
        const stats = countLines(filePath, language);
        results[language].code += stats.code;
        results[language].comment += stats.comment;
        results[language].blank += stats.blank;
      }
    }
  });
}

// メイン処理
const results = {};
traverseDirectory(dirPath, results);

// 結果の表示
console.log(
  "| Language   | Files | Code Lines | Comment Lines | Blank Lines | Total Lines |"
);
console.log(
  "|------------|-------|------------|---------------|-------------|-------------|"
);

let totalFiles = 0,
  totalCode = 0,
  totalComment = 0,
  totalBlank = 0;

Object.keys(results).forEach((lang) => {
  const { files, code, comment, blank } = results[lang];
  const total = code + comment + blank;
  console.log(
    `| ${config.languages[lang].name.padEnd(10)} | ${files
      .toString()
      .padStart(5)} | ${code.toString().padStart(10)} | ${comment
      .toString()
      .padStart(13)} | ${blank.toString().padStart(11)} | ${total
      .toString()
      .padStart(11)} |`
  );
  totalFiles += files;
  totalCode += code;
  totalComment += comment;
  totalBlank += blank;
});

const grandTotal = totalCode + totalComment + totalBlank;
console.log(
  `| ${"Total".padEnd(10)} | ${totalFiles.toString().padStart(5)} | ${totalCode
    .toString()
    .padStart(10)} | ${totalComment.toString().padStart(13)} | ${totalBlank
    .toString()
    .padStart(11)} | ${grandTotal.toString().padStart(11)} |`
);
