const { formatOutput } = require("../src/outputFormatter");

describe("formatOutput", () => {
  it("正しく出力をフォーマットする", () => {
    const input = {
      JavaScript: {
        files: 10,
        codeLines: 100,
        commentLines: 50,
        blankLines: 20,
        totalLines: 170,
      },
      TypeScript: {
        files: 5,
        codeLines: 80,
        commentLines: 30,
        blankLines: 10,
        totalLines: 120,
      },
    };

    const expected = `| Language   | Files | Code Lines | Comment Lines | Blank Lines | Total Lines |
|------------|-------|------------|---------------|-------------|-------------|
| JavaScript | 10    | 100        | 50            | 20          | 170         |
| TypeScript | 5     | 80         | 30            | 10          | 120         |
| Total      | 15    | 180        | 80            | 30          | 290         |
`;

    const result = formatOutput(input);
    expect(result).toBe(expected);
  });
});
