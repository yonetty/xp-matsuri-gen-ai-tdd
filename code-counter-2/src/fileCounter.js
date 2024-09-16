const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function loadConfig() {
  const configPath = path.join(__dirname, "..", "config.yml");
  const config = yaml.load(fs.readFileSync(configPath, "utf8"));
  return config;
}

function isExcludedDirectory(dirPath, excludedDirs) {
  return excludedDirs.some((dir) => dirPath.includes(dir));
}

function getFilesByLanguage(dirPath, languages) {
  const config = loadConfig();
  const files = {};

  function traverseDirectory(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (!isExcludedDirectory(fullPath, config.excludedDirectories)) {
          traverseDirectory(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        const language = config.languages.find((lang) =>
          lang.extensions.includes(ext)
        );

        if (language && (!languages || languages.includes(language.name))) {
          if (!files[language.name]) {
            files[language.name] = [];
          }
          files[language.name].push(fullPath);
        }
      }
    }
  }

  traverseDirectory(dirPath);
  return files;
}

module.exports = { getFilesByLanguage };
