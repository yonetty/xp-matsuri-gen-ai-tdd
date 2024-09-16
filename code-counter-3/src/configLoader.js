const fs = require("fs").promises;
const yaml = require("js-yaml");

async function loadConfig() {
  const configPath = "./config.yml";
  const configFile = await fs.readFile(configPath, "utf-8");
  return yaml.load(configFile);
}

module.exports = { loadConfig };
