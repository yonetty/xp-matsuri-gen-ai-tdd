const { countLines } = require("../src/lineCounter");
const fs = require("fs").promises;

jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

describe("countLines", () => {
  const mockConfig = {
    languages: {
      JavaScript: { commentPattern: "^\\s*\\/\\/|^\\s*\\/\\*|\\*\\/\\s*$" },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("counts lines correctly", async () => {
    fs.readFile.mockResolvedValue(
      "const a = 1;\n" +
        "// This is a comment\n" +
        "\n" +
        "function test() {\n" +
        "  return a;\n" +
        "}"
    );

    const files = [{ path: "/test/file1.js", language: "JavaScript" }];

    const result = await countLines(files, mockConfig);

    expect(result).toEqual({
      JavaScript: {
        files: 1,
        code: 4,
        comment: 1,
        blank: 1,
      },
    });
  });
});
