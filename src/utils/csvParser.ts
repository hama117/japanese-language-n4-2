import { Question } from '../types/Question';
import { validateCSVFormat, validateQuestionFormat, validateAnswer } from './csvValidation';

const cleanCSVContent = (csv: string): string[] => {
  // BOMを除去し、改行コードを統一
  const cleanCsv = csv.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const lines = cleanCsv.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('CSVファイルが空です。');
  }
  
  return lines;
};

const parseLine = (line: string, index: number): Question => {
  try {
    const [category, description, questionText, answerStr] = validateCSVFormat(line, index);
    const { question, options } = validateQuestionFormat(questionText, index);
    const correctAnswer = validateAnswer(answerStr, index);

    return {
      category,
      question,
      options,
      correctAnswer
    };
  } catch (error) {
    throw error;
  }
};

export const parseCSV = (csv: string): Question[] => {
  try {
    const lines = cleanCSVContent(csv);
    return lines.map((line, index) => parseLine(line, index));
  } catch (error) {
    console.error('CSV parsing error:', error);
    throw error instanceof Error ? error : new Error('CSVファイルの解析中に予期せぬエラーが発生しました。');
  }
};