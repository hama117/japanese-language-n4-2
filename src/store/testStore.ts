import { create } from 'zustand';
import { TestState } from '../types/Question';

const useTestStore = create<TestState>((set) => ({
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  selectedLanguage: '',
  answers: [],
  setQuestions: (questions) => set({ questions }),
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  setScore: (score) => set({ score }),
  setSelectedLanguage: (language) => set({ selectedLanguage: language }),
  addAnswer: (answer) => set((state) => ({
    answers: [...state.answers, answer],
  })),
  resetTest: () => set({
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
  }),
}));

export default useTestStore;