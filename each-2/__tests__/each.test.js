const { each } = require("../src/each");

describe("each関数のテスト", () => {
  test("入力が空の場合", () => {
    const mockCallback = jest.fn();
    each``(mockCallback);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  test.skip("データ行の数だけコールバックが呼ばれ、引数にはそれぞれのデータが渡される（属性1つ）", () => {
    const mockCallback = jest.fn();
    each`
        name
        ${"Alice"}
        ${"Bob"}
        ${"Charlie"}
    `(mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(mockCallback).toHaveBeenNthCalledWith(1, {
      name: "Alice",
    });
    expect(mockCallback).toHaveBeenNthCalledWith(2, {
      name: "Bob",
    });
    expect(mockCallback).toHaveBeenNthCalledWith(3, {
      name: "Charlie",
    });
  });

  test.skip("データ行の数だけコールバックが呼ばれ、引数にはそれぞれのデータが渡される", () => {
    const mockCallback = jest.fn();
    each`
        name | age | isAdmin
        ${"Alice"} | ${25} | ${true}
        ${"Bob"} | ${30} | ${false}
        ${"Charlie"} | ${35} | ${true}
    `(mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(mockCallback).toHaveBeenNthCalledWith(1, {
      name: "Alice",
      age: 25,
      isAdmin: true,
    });
    expect(mockCallback).toHaveBeenNthCalledWith(2, {
      name: "Bob",
      age: 30,
      isAdmin: false,
    });
    expect(mockCallback).toHaveBeenNthCalledWith(3, {
      name: "Charlie",
      age: 35,
      isAdmin: true,
    });
  });
});
