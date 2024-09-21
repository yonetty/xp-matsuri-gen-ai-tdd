const { each } = require("../src/each");

describe("each function", () => {
  test("属性が1つの場合に正しくコールバックが呼ばれる", () => {
    const callback = jest.fn();
    each`
    name
    ${"Alice"}
    `(callback);
    expect(callback).toHaveBeenCalledWith({ name: "Alice" });
  });

  test("属性が2つの場合に正しくコールバックが呼ばれる", () => {
    const callback = jest.fn();
    each`
    name | age
    ${"Alice"} | ${20}
    `(callback);
    expect(callback).toHaveBeenCalledWith({ name: "Alice", age: 20 });
  });

  test("属性、レコードともに複数の場合に正しくコールバックが呼ばれる", () => {
    const callback = jest.fn();
    each`
    name | age
    ${"Alice"} | ${20}
    ${"Bob"} | ${30}
    `(callback);
    expect(callback).toHaveBeenCalledWith({ name: "Alice", age: 20 });
    expect(callback).toHaveBeenCalledWith({ name: "Bob", age: 30 });
  });
});
