const { countFiles } = require("../src/fileCounter");
const fs = require("fs").promises;
const path = require("path");

jest.mock("fs", () => ({
  promises: {
    readdir: jest.fn(),
    stat: jest.fn(),
  },
}));

describe("countFiles", () => {
  const mockConfig = {
    languages: {
      JavaScript: { extensions: ["js"] },
      TypeScript: { extensions: ["ts"] },
    },
    excludedDirectories: ["node_modules"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("counts files correctly", async () => {
    fs.readdir.mockResolvedValueOnce([
      { name: "file1.js", isFile: () => true, isDirectory: () => false },
      { name: "file2.ts", isFile: () => true, isDirectory: () => false },
      { name: "subdir", isFile: () => false, isDirectory: () => true },
    ]);

    fs.readdir.mockResolvedValueOnce([
      { name: "file3.js", isFile: () => true, isDirectory: () => false },
    ]);

    const result = await countFiles("/test", mockConfig);

    expect(result).toEqual([
      { path: "/test/file1.js", language: "JavaScript" },
      { path: "/test/file2.ts", language: "TypeScript" },
      { path: "/test/subdir/file3.js", language: "JavaScript" },
    ]);
  });

  it("excludes specified directories", async () => {
    fs.readdir.mockResolvedValueOnce([
      { name: "file1.js", isFile: () => true, isDirectory: () => false },
      { name: "node_modules", isFile: () => false, isDirectory: () => true },
    ]);

    const result = await countFiles("/test", mockConfig);

    expect(result).toEqual([
      { path: "/test/file1.js", language: "JavaScript" },
    ]);
  });
});
