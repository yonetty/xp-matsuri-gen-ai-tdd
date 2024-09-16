const { parseArguments } = require("../src/argumentParser");

describe("parseArguments", () => {
  test("ディレクトリのみ指定された場合、正しくパースされること", () => {
    const args = ["/path/to/directory"];
    const result = parseArguments(args);
    expect(result).toEqual({
      directory: "/path/to/directory",
      languages: undefined,
    });
  });

  test("ディレクトリと1つの言語が指定された場合、正しくパースされること", () => {
    const args = ["/path/to/directory", "javascript"];
    const result = parseArguments(args);
    expect(result).toEqual({
      directory: "/path/to/directory",
      languages: ["javascript"],
    });
  });

  test("ディレクトリと複数の言語が指定された場合、正しくパースされること", () => {
    const args = ["/path/to/directory", "javascript,typescript,python"];
    const result = parseArguments(args);
    expect(result).toEqual({
      directory: "/path/to/directory",
      languages: ["javascript", "typescript", "python"],
    });
  });

  test("引数が不足している場合、エラーがスローされること", () => {
    const args = [];
    expect(() => parseArguments(args)).toThrow(
      "ディレクトリパスを指定してください。"
    );
  });

  test("余分な引数がある場合、エラーがスローされること", () => {
    const args = ["/path/to/directory", "javascript", "extra"];
    expect(() => parseArguments(args)).toThrow("無効な引数です。");
  });
});
