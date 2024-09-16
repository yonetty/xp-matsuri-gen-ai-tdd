function parseArguments(args) {
  if (args.length === 0) {
    throw new Error("ディレクトリパスを指定してください。");
  }

  if (args.length > 2) {
    throw new Error("無効な引数です。");
  }

  const directory = args[0];
  let languages;

  if (args.length === 2) {
    languages = args[1].split(",").map((lang) => lang.trim());
  }

  return {
    directory,
    languages,
  };
}

module.exports = { parseArguments };
