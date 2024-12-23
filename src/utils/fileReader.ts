export const readCSVFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith('.csv')) {
      reject(new Error('CSVファイルのみアップロード可能です。'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        resolve(content);
      } else {
        reject(new Error('ファイルの内容が空です。'));
      }
    };
    reader.onerror = () => reject(new Error('ファイルの読み込み中にエラーが発生しました。'));
    reader.readAsText(file, 'UTF-8');
  });
};