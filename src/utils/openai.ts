import { OpenAI } from 'openai';
import { Question } from '../types/Question';

const LANGUAGE_PROMPTS = {
  en: {
    systemPrompt: "You are a Japanese language teacher providing explanations in English. Be clear and educational.",
    userPrompt: (question: Question, userAnswer: number, isCorrect: boolean) => `
      Explain this Japanese question in English:
      Question: ${question.question}
      Options: ${question.options.join(', ')}
      Correct answer: ${question.options[question.correctAnswer - 1]}
      User's answer: ${question.options[userAnswer - 1]}
      Was correct: ${isCorrect}
    `
  },
  zh: {
    systemPrompt: "你是一位用中文解释日语的老师。请保持解释清晰易懂且具有教育意义。",
    userPrompt: (question: Question, userAnswer: number, isCorrect: boolean) => `
      用中文解释这道日语题：
      题目：${question.question}
      选项：${question.options.join(', ')}
      正确答案：${question.options[question.correctAnswer - 1]}
      用户答案：${question.options[userAnswer - 1]}
      是否正确：${isCorrect}
    `
  },
  vi: {
    systemPrompt: "Bạn là giáo viên tiếng Nhật giải thích bằng tiếng Việt. Hãy giải thích rõ ràng và mang tính giáo dục.",
    userPrompt: (question: Question, userAnswer: number, isCorrect: boolean) => `
      Giải thích câu hỏi tiếng Nhật này bằng tiếng Việt:
      Câu hỏi: ${question.question}
      Các lựa chọn: ${question.options.join(', ')}
      Đáp án đúng: ${question.options[question.correctAnswer - 1]}
      Câu trả lời của người dùng: ${question.options[userAnswer - 1]}
      Có đúng không: ${isCorrect}
    `
  },
  id: {
    systemPrompt: "Anda adalah guru bahasa Jepang yang memberikan penjelasan dalam bahasa Indonesia. Berikan penjelasan yang jelas dan edukatif.",
    userPrompt: (question: Question, userAnswer: number, isCorrect: boolean) => `
      Jelaskan pertanyaan bahasa Jepang ini dalam bahasa Indonesia:
      Pertanyaan: ${question.question}
      Pilihan: ${question.options.join(', ')}
      Jawaban benar: ${question.options[question.correctAnswer - 1]}
      Jawaban pengguna: ${question.options[userAnswer - 1]}
      Apakah benar: ${isCorrect}
    `
  }
};

export const generateExplanation = async (
  question: Question,
  userAnswer: number,
  isCorrect: boolean,
  apiKey: string,
  selectedLanguage: string
): Promise<string> => {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  const languageConfig = LANGUAGE_PROMPTS[selectedLanguage as keyof typeof LANGUAGE_PROMPTS] || LANGUAGE_PROMPTS.en;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: languageConfig.systemPrompt
        },
        {
          role: "user",
          content: languageConfig.userPrompt(question, userAnswer, isCorrect)
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating explanation:', error);
    return 'Error generating explanation. Please try again.';
  }
};