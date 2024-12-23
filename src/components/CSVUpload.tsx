import React, { DragEvent, useState } from 'react';
import { Upload } from 'lucide-react';
import { readCSVFile } from '../utils/fileReader';

interface CSVUploadProps {
  onFileUpload: (csvContent: string) => void;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileProcess = async (file: File) => {
    try {
      const content = await readCSVFile(file);
      onFileUpload(content);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'ファイルの処理中にエラーが発生しました。');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">問題データのアップロード</h2>
      <div className="w-full">
        <label 
          htmlFor="csv-upload"
          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className={`w-10 h-10 mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">CSVファイルを選択</span>
            </p>
            <p className="text-xs text-gray-500">
              または、ここにドラッグ＆ドロップ
            </p>
          </div>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <div className="mt-4 text-sm text-gray-500">
          <p className="font-semibold mb-2">CSVファイルの形式:</p>
          <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
            カテゴリー,説明文,問題文 1選択肢1 2選択肢2 3選択肢3 4選択肢4,正解番号
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CSVUpload;