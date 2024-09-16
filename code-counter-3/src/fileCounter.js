const fs = require("fs").promises;
const path = require("path");

async function countFiles(dirPath, config, languages) {
  const files = [];
  const items = await fs.readdir(dirPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);

    if (item.isDirectory() && !config.excludedDirectories.includes(item.name)) {
      files.push(...(await countFiles(fullPath, config, languages)));
    } else if (item.isFile()) {
      const ext = path.extname(item.name).slice(1);
      const lang = Object.keys(config.languages).find((lang) =>
        config.languages[lang].extensions.includes(ext)
      );

      if (lang && (!languages || languages.includes(lang))) {
        files.push({ path: fullPath, language: lang });
      }
    }
  }

  return files;
}

module.exports = { countFiles };
