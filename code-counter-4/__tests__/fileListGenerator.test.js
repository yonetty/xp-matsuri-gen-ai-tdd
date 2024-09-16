const path = require("path");
const fs = require("fs").promises;
const { getFileList } = require("../src/fileListGenerator");

// テスト用のディレクトリ構造を作成する関数
async function createTestDirectory(structure, basePath = ".") {
  for (const [name, content] of Object.entries(structure)) {
    const fullPath = path.join(basePath, name);
    if (typeof content === "string") {
      await fs.writeFile(fullPath, content);
    } else {
      await fs.mkdir(fullPath, { recursive: true });
      await createTestDirectory(content, fullPath);
    }
  }
}

describe("getFileList", () => {
  const testDir = path.join(__dirname, "test-dir");
  const config = {
    languages: {
      javascript: { extensions: [".js"] },
      python: { extensions: [".py"] },
    },
    exclude_directories: ["node_modules"],
  };

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
    await createTestDirectory(
      {
        "file1.js": 'console.log("Hello");',
        "file2.py": 'print("Hello")',
        "file3.txt": "Hello",
        subdir: {
          "file4.js": "const x = 1;",
          "file5.py": "x = 1",
        },
        node_modules: {
          "file6.js": "module.exports = {};",
        },
      },
      testDir
    );
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  test("すべての対象ファイルを取得できること", async () => {
    const result = await getFileList(testDir, undefined, config);
    expect(result).toHaveLength(4);
    expect(result).toEqual(
      expect.arrayContaining([
        { path: path.join(testDir, "file1.js"), language: "javascript" },
        { path: path.join(testDir, "file2.py"), language: "python" },
        {
          path: path.join(testDir, "subdir", "file4.js"),
          language: "javascript",
        },
        { path: path.join(testDir, "subdir", "file5.py"), language: "python" },
      ])
    );
  });

  test("特定の言語のファイルのみを取得できること", async () => {
    const result = await getFileList(testDir, ["javascript"], config);
    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        { path: path.join(testDir, "file1.js"), language: "javascript" },
        {
          path: path.join(testDir, "subdir", "file4.js"),
          language: "javascript",
        },
      ])
    );
  });

  test("除外ディレクトリ内のファイルが取得されないこと", async () => {
    const result = await getFileList(testDir, undefined, config);
    expect(result).not.toEqual(
      expect.arrayContaining([
        {
          path: path.join(testDir, "node_modules", "file6.js"),
          language: "javascript",
        },
      ])
    );
  });

  test("存在しないディレクトリを指定した場合にエラーが発生すること", async () => {
    await expect(
      getFileList(path.join(testDir, "non-existent"), undefined, config)
    ).rejects.toThrow("指定されたディレクトリが存在しません");
  });

  test("空のディレクトリを指定した場合に空の配列が返されること", async () => {
    const emptyDir = path.join(testDir, "empty");
    await fs.mkdir(emptyDir);
    const result = await getFileList(emptyDir, undefined, config);
    expect(result).toEqual([]);
  });
});
