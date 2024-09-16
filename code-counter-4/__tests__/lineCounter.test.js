const fs = require("fs").promises;
const path = require("path");
const { countLines } = require("../src/lineCounter");

describe("countLines", () => {
  const testDir = path.join(__dirname, "test-files");
  const config = {
    languages: {
      javascript: {
        extensions: [".js"],
        comment_patterns: [/^\s*\/\/.*/],
      },
      python: {
        extensions: [".py"],
        comment_patterns: [/^\s*#.*/],
      },
      markdown: {
        extensions: [".md"],
        comment_patterns: [],
      },
    },
  };

  beforeAll(async () => {
    await fs.mkdir(testDir, { recursive: true });
    await fs.writeFile(
      path.join(testDir, "test1.js"),
      `
// This is a comment
const x = 1;

console.log(x);

// Another comment`.trim()
    );
    await fs.writeFile(
      path.join(testDir, "test2.py"),
      `
# This is a comment
x = 1

print(x)

# Another comment`.trim()
    );
    await fs.writeFile(
      path.join(testDir, "test3.js"),
      `
// Another JS file
function hello() {
  console.log("Hello");
}

// End of file`.trim()
    );
    await fs.writeFile(path.join(testDir, "empty.js"), "");
    // 新しいMarkdownファイルを追加
    await fs.writeFile(
      path.join(testDir, "test.md"),
      `
# This is a heading
This is normal text

> This is a blockquote
- This is a list item`.trim()
    );
  });

  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  test("単一のJavaScriptファイルの行数を正しくカウントできること", async () => {
    const files = [
      { path: path.join(testDir, "test1.js"), language: "javascript" },
    ];
    const result = await countLines(files, config);
    expect(result).toEqual({
      javascript: { files: 1, code: 2, comment: 2, blank: 2, total: 6 },
    });
  });

  test("単一のPythonファイルの行数を正しくカウントできること", async () => {
    const files = [
      { path: path.join(testDir, "test2.py"), language: "python" },
    ];
    const result = await countLines(files, config);
    expect(result).toEqual({
      python: { files: 1, code: 2, comment: 2, blank: 2, total: 6 },
    });
  });

  test("複数の言語のファイルの行数を正しくカウントできること", async () => {
    const files = [
      { path: path.join(testDir, "test1.js"), language: "javascript" },
      { path: path.join(testDir, "test2.py"), language: "python" },
    ];
    const result = await countLines(files, config);
    expect(result).toEqual({
      javascript: { files: 1, code: 2, comment: 2, blank: 2, total: 6 },
      python: { files: 1, code: 2, comment: 2, blank: 2, total: 6 },
    });
  });

  test("複数のJavaScriptファイルの行数を正しくカウントできること", async () => {
    const files = [
      { path: path.join(testDir, "test1.js"), language: "javascript" },
      { path: path.join(testDir, "test3.js"), language: "javascript" },
    ];
    const result = await countLines(files, config);
    expect(result).toEqual({
      javascript: { files: 2, code: 5, comment: 4, blank: 3, total: 12 },
    });
  });

  test("空のファイルを正しく処理できること", async () => {
    const files = [
      { path: path.join(testDir, "empty.js"), language: "javascript" },
    ];
    const result = await countLines(files, config);
    expect(result).toEqual({
      javascript: { files: 1, code: 0, comment: 0, blank: 0, total: 0 },
    });
  });

  test("存在しないファイルに対してエラーを投げること", async () => {
    const files = [
      { path: path.join(testDir, "non-existent.js"), language: "javascript" },
    ];
    await expect(countLines(files, config)).rejects.toThrow(
      "ファイルが見つかりません"
    );
  });

  test("comment_patterns が空配列の場合、すべての行をコードとしてカウントすること", async () => {
    const files = [
      { path: path.join(testDir, "test.md"), language: "markdown" },
    ];
    const result = await countLines(files, config);
    expect(result).toEqual({
      markdown: { files: 1, code: 4, comment: 0, blank: 1, total: 5 },
    });
  });
});
