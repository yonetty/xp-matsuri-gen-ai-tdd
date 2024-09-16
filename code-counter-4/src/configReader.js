const fs = require("fs").promises;
const yaml = require("js-yaml");

async function readConfig(configPath) {
  try {
    const fileContents = await fs.readFile(configPath, "utf8");
    const config = yaml.load(fileContents);

    // 正規表現パターンを文字列から正規表現オブジェクトに変換
    for (const language in config.languages) {
      if (config.languages[language].comment_patterns) {
        config.languages[language].comment_patterns = config.languages[
          language
        ].comment_patterns.map((pattern) => new RegExp(pattern));
      }
    }

    return config;
  } catch (error) {
    throw new Error(`設定ファイルの読み込みに失敗しました: ${error.message}`);
  }
}

module.exports = { readConfig };
