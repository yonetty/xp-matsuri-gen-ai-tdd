const { formatOutput } = require("../src/outputFormatter");

describe("formatOutput", () => {
  it("formats output correctly", () => {
    const input = {
      JavaScript: { files: 2, code: 100, comment: 20, blank: 10 },
      TypeScript: { files: 1, code: 50, comment: 10, blank: 5 },
    };

    const expected =
      "| Language   | Files | Code Lines | Comment Lines | Blank Lines | Total Lines |\n" +
      "|------------|-------|------------|---------------|-------------|-------------|\n" +
      "| JavaScript | 2     | 100        | 20            | 10          | 130         |\n" +
      "| TypeScript | 1     | 50         | 10            | 5           | 65          |\n" +
      "| Total      | 3     | 150        | 30            | 15          | 195         |";

    const result = formatOutput(input);
    expect(result).toBe(expected);
  });
});
