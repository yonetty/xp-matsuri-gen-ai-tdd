const { generateReport } = require("../src/reportGenerator");

describe("generateReport", () => {
  test("単一の言語のデータを正しくレポート形式に変換できること", () => {
    const data = {
      javascript: { files: 1, code: 50, comment: 10, blank: 5, total: 65 },
    };
    const result = generateReport(data);
    expect(result).toContain(
      "| Language   | Files | Code Lines | Comment Lines | Blank Lines | Total Lines |"
    );
    expect(result).toMatch(
      /\| javascript \| 1     \| 50         \| 10            \| 5           \| 65          \|/
    );
    expect(result).toMatch(
      /\| Total      \| 1     \| 50         \| 10            \| 5           \| 65          \|/
    );
  });

  test("複数の言語のデータを正しくレポート形式に変換できること", () => {
    const data = {
      javascript: { files: 2, code: 100, comment: 20, blank: 10, total: 130 },
      python: { files: 1, code: 50, comment: 5, blank: 5, total: 60 },
    };
    const result = generateReport(data);
    expect(result).toContain(
      "| Language   | Files | Code Lines | Comment Lines | Blank Lines | Total Lines |"
    );
    expect(result).toMatch(
      /\| javascript \| 2     \| 100        \| 20            \| 10          \| 130         \|/
    );
    expect(result).toMatch(
      /\| python     \| 1     \| 50         \| 5             \| 5           \| 60          \|/
    );
    expect(result).toMatch(
      /\| Total      \| 3     \| 150        \| 25            \| 15          \| 190         \|/
    );
  });

  test("空のデータセットに対して適切に処理できること", () => {
    const data = {};
    const result = generateReport(data);
    expect(result).toContain(
      "| Language   | Files | Code Lines | Comment Lines | Blank Lines | Total Lines |"
    );
    expect(result).toMatch(
      /\| Total      \| 0     \| 0          \| 0             \| 0           \| 0           \|/
    );
  });

  test("言語名がdata オブジェクトのキー名と一致していること", () => {
    const data = {
      javascript: { files: 1, code: 50, comment: 10, blank: 5, total: 65 },
      typeScript: { files: 1, code: 40, comment: 8, blank: 4, total: 52 },
    };
    const result = generateReport(data);
    expect(result).toMatch(/\| javascript \|/);
    expect(result).toMatch(/\| typeScript \|/);
  });

  test("数値が正しく右寄せされていること", () => {
    const data = {
      javascript: {
        files: 100,
        code: 5000,
        comment: 1000,
        blank: 500,
        total: 6500,
      },
    };
    const result = generateReport(data);
    expect(result).toMatch(
      /\| javascript \| 100   \| 5000       \| 1000          \| 500         \| 6500        \|/
    );
  });

  test("合計行が正しく計算されていること", () => {
    const data = {
      javascript: { files: 2, code: 100, comment: 20, blank: 10, total: 130 },
      python: { files: 1, code: 50, comment: 5, blank: 5, total: 60 },
      ruby: { files: 3, code: 150, comment: 30, blank: 15, total: 195 },
    };
    const result = generateReport(data);
    expect(result).toMatch(
      /\| Total      \| 6     \| 300        \| 55            \| 30          \| 385         \|/
    );
  });
});
