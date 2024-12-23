export interface Question {
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface TestState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  selectedLanguage: string;
  answers: Array<{
    question: Question;
    userAnswer: number | null;
    isCorrect: boolean;
  }>;
}