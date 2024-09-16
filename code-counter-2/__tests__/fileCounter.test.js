const { getFilesByLanguage } = require("../src/fileCounter");
const fs = require("fs");
const path = require("path");

jest.mock("fs");
jest.mock("js-yaml");

describe("getFilesByLanguage", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("正しくファイルを言語ごとに分類する", () => {
    const mockConfig = {
      languages: [
        { name: "JavaScript", extensions: [".js"] },
        { name: "TypeScript", extensions: [".ts"] },
      ],
      excludedDirectories: ["node_modules"],
    };

    require("js-yaml").load.mockReturnValue(mockConfig);

    const mockFileStructure = {
      src: {
        "index.js": "",
        "app.js": "",
        utils: {
          "helper.ts": "",
        },
        node_modules: {
          package: {
            "index.js": "",
          },
        },
      },
    };

    fs.readdirSync.mockImplementation((dir) => {
      return Object.keys(mockFileStructure[dir]).map((name) => ({
        name,
        isDirectory: () => typeof mockFileStructure[dir][name] === "object",
        isFile: () => typeof mockFileStructure[dir][name] === "string",
      }));
    });

    fs.statSync.mockImplementation((file) => ({
      isDirectory: () => typeof file === "object",
      isFile: () => typeof file === "string",
    }));

    const result = getFilesByLanguage("src");

    expect(result).toEqual({
      JavaScript: [path.join("src", "index.js"), path.join("src", "app.js")],
      TypeScript: [path.join("src", "utils", "helper.ts")],
    });
  });
});
