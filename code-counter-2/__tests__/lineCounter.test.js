const { countLinesForLanguage } = require("../src/lineCounter");
const fs = require("fs");
const yaml = require("js-yaml");

jest.mock("fs");
jest.mock("js-yaml");

describe("countLinesForLanguage", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("正しく行数をカウントする", () => {
    const mockConfig = {
      languages: [{ name: "JavaScript", commentRegex: "^\\s*(//|/*|*)" }],
    };

    yaml.load.mockReturnValue(mockConfig);

    const mockFileContent = `
// This is a comment
const a = 1;

/* Multi-line
   comment */
const b = 2;

// Another comment
    `.trim();

    fs.readFileSync.mockReturnValue(mockFileContent);

    const result = countLinesForLanguage(
      ["file1.js", "file2.js"],
      "JavaScript"
    );

    expect(result).toEqual({
      files: 2,
      codeLines: 4,
      commentLines: 4,
      blankLines: 1,
      totalLines: 9,
    });
  });
});
