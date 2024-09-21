function each(fragments, ...values) {
  // コールバック関数を受け取る関数を返す
  return (callback) => {
    // 空の入力の場合は何もしない
    if (fragments.length <= 1) return;

    // ヘッダー（属性名）を取得
    const header = fragments[0].trim().split(/\s*\|\s*/);

    // データ行を処理
    const rowCount = values.length / header.length;
    for (let i = 0; i < rowCount; i++) {
      const data = {};
      for (let j = 0; j < header.length; j++) {
        data[header[j]] = values[i * header.length + j];
      }
      callback(data);
    }
  };
}

module.exports = {
  each,
};
