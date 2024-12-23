import React, { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';
import QuestionCard from './components/QuestionCard';
import CSVUpload from './components/CSVUpload';
import useTestStore from './store/testStore';
import { parseCSV } from './utils/csvParser';
import { generateExplanation } from './utils/openai';
import { RotateCcw } from 'lucide-react';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);

  const {
    questions,
    currentQuestionIndex,
    selectedLanguage,
    score,
    answers,
    setQuestions,
    setCurrentQuestionIndex,
    setScore,
    addAnswer,
    resetTest,
  } = useTestStore();

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setIsApiKeySet(true);
    }
  };

  const handleFileUpload = (csvContent: string) => {
    try {
      setCsvError(null);
      const parsedQuestions = parseCSV(csvContent);
      if (parsedQuestions.length === 0) {
        throw new Error('有効な問題が見つかりませんでした。');
      }
      setQuestions(parsedQuestions);
    } catch (error) {
      console.error('CSV parsing error:', error);
      setCsvError(error instanceof Error ? error.message : 'CSVの解析中にエラーが発生しました。');
    }
  };

  const handleAnswer = async (answer: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    addAnswer({
      question: currentQuestion,
      userAnswer: answer,
      isCorrect,
    });

    setIsLoading(true);
    const explanationText = await generateExplanation(
      currentQuestion,
      answer,
      isCorrect,
      apiKey,
      selectedLanguage
    );
    setExplanation(explanationText);
    setIsLoading(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setExplanation(null);
    }
  };

  const handleReset = () => {
    if (window.confirm('テストをリセットしますか？')) {
      resetTest();
      setExplanation(null);
    }
  };

  if (!isApiKeySet) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <form onSubmit={handleApiKeySubmit} className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">OpenAI APIキーを入力</h2>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            placeholder="sk-..."
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            開始
          </button>
        </form>
      </div>
    );
  }

  if (!selectedLanguage) {
    return <LanguageSelector />;
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md">
          <CSVUpload onFileUpload={handleFileUpload} />
          {csvError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {csvError}
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              問題 {currentQuestionIndex + 1} / {questions.length}
            </div>
            <div>
              スコア: {score}/{answers.length}
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            リセット
          </button>
        </div>

        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          explanation={explanation}
          userAnswer={currentAnswer?.userAnswer ?? null}
          isAnswered={!!currentAnswer}
        />

        {currentAnswer && (
          <div className="mt-4 text-center">
            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              次の問題
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;