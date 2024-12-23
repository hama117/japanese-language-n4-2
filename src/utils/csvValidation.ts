export const validateCSVFormat = (line: string, index: number) => {
  const parts = line.split(',').map(part => part.trim());
  
  if (parts.length !== 4) {
    throw new Error(`行 ${index + 1}: 正しいCSV形式ではありません。カテゴリー,説明文,問題文,正解番号の形式で入力してください。`);
  }

  return parts;
};

export const validateQuestionFormat = (questionText: string, index: number) => {
  // 問題文と選択肢を分離する正規表現を更新
  const questionParts = questionText.match(/^(.+?)\s*1\s*(.+?)\s*2\s*(.+?)\s*3\s*(.+?)\s*4\s*(.+?)$/);
  
  if (!questionParts) {
    throw new Error(`行 ${index + 1}: 問題文のフォーマットが正しくありません。"問題文 1選択肢1 2選択肢2 3選択肢3 4選択肢4" の形式で入力してください。`);
  }

  // 選択肢からスペースを適切に処理
  const [, question, ...options] = questionParts;
  return {
    question: question.trim(),
    options: options.map(opt => opt.trim())
  };
};

export const validateAnswer = (answer: string, index: number) => {
  const num = parseInt(answer, 10);
  if (isNaN(num) || num < 1 || num > 4) {
    throw new Error(`行 ${index + 1}: 正解番号は1から4の間の数字を入力してください。`);
  }
  return num;
};