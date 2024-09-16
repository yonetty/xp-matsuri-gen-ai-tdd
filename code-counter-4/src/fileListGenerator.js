const fs = require("fs").promises;
const path = require("path");

async function getFileList(directory, languages, config) {
  try {
    const stats = await fs.stat(directory);
    if (!stats.isDirectory()) {
      throw new Error("指定されたパスはディレクトリではありません");
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error("指定されたディレクトリが存在しません");
    }
    throw error;
  }

  const files = await walkDirectory(directory, languages, config);
  return files;
}

async function walkDirectory(dir, languages, config) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        if (config.exclude_directories.includes(dirent.name)) {
          return [];
        }
        return walkDirectory(res, languages, config);
      } else {
        const fileInfo = getFileInfo(res, config.languages);
        if (fileInfo && (!languages || languages.includes(fileInfo.language))) {
          return [fileInfo];
        }
        return [];
      }
    })
  );
  return files.flat();
}

function getFileInfo(filePath, languagesConfig) {
  const ext = path.extname(filePath);
  for (const [language, config] of Object.entries(languagesConfig)) {
    if (config.extensions.includes(ext)) {
      return { path: filePath, language };
    }
  }
  return null;
}

module.exports = { getFileList };
