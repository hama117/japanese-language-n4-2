import { Question } from '../types/Question';

// Map of questions and their correct answers
const KNOWN_ANSWERS = new Map([
  ['小説', 3], // しょうせつ is the correct answer (index 2 + 1)
  ['店員', 4], // てんいん is the correct answer (index 3 + 1)
  ['食堂', 2], // しょくどう is the correct answer (index 1 + 1)
  ['港', 2], // みなと is the correct answer (index 1 + 1)
  ['日記', 1], // にっき is the correct answer (index 0 + 1)
  ['夕方', 2], // ゆうがた is the correct answer (index 1 + 1)
  ['青い', 1], // 青い is the correct answer (index 0 + 1)
  ['歩いて', 4], // 歩いて is the correct answer (index 3 + 1)
  ['便利', 4], // 便利 is the correct answer (index 3 + 1)
]);

export const determineCorrectAnswer = (question: string, options: string[]): number => {
  // Extract the key word from the question (usually within __word__)
  const keyWordMatch = question.match(/__(.+?)__/);
  if (!keyWordMatch) return 1; // Default to 1 if no match found

  const keyWord = keyWordMatch[1];
  return KNOWN_ANSWERS.get(keyWord) || 1; // Default to 1 if answer not found
};