function each(fragments, ...values) {
  const attrs = fragments[0].split("|").map((s) => s.trim());
  const numOfAttrs = attrs.length;
  const array = [];
  let index = 0;
  while (index < values.length) {
    const row = values.slice(index, index + numOfAttrs);
    const obj = attrs.reduce((o, attr, i) => {
      return { ...o, [attr]: row[i] };
    }, {});
    array.push(obj);
    index += numOfAttrs;
  }
  return (callback) => {
    array.forEach((e) => callback(e));
  };
}

module.exports = {
  each,
};
