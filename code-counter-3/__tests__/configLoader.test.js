const { loadConfig } = require("../src/configLoader");
const fs = require("fs").promises;
const yaml = require("js-yaml");

jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

jest.mock("js-yaml", () => ({
  load: jest.fn(),
}));

describe("loadConfig", () => {
  it("loads config correctly", async () => {
    const mockYaml = "languages:\n  JavaScript:\n    extensions:\n      - js\n";
    const mockConfig = {
      languages: {
        JavaScript: {
          extensions: ["js"],
        },
      },
    };

    fs.readFile.mockResolvedValue(mockYaml);
    yaml.load.mockReturnValue(mockConfig);

    const result = await loadConfig();

    expect(fs.readFile).toHaveBeenCalledWith("./config.yml", "utf-8");
    expect(yaml.load).toHaveBeenCalledWith(mockYaml);
    expect(result).toEqual(mockConfig);
  });
});
