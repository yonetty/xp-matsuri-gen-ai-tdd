const fs = require("fs").promises;
const yaml = require("js-yaml");

async function readConfig(configPath) {
  try {
    const fileContents = await fs.readFile(configPath, "utf8");
    const config = yaml.load(fileContents);
    return config;
  } catch (error) {
    throw new Error(`設定ファイルの読み込みに失敗しました: ${error.message}`);
  }
}

module.exports = { readConfig };
