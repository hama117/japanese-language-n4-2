import React, { useState, useEffect } from 'react';
import { Question } from '../types/Question';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: number) => void;
  explanation: string | null;
  userAnswer: number | null;
  isAnswered: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  explanation,
  userAnswer,
  isAnswered,
}) => {
  const isCorrect = userAnswer === question.correctAnswer;
  const [displayedExplanation, setDisplayedExplanation] = useState('');
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (explanation) {
      const words = explanation.split(' ');
      if (wordIndex < words.length) {
        const timer = setTimeout(() => {
          setDisplayedExplanation(prev => prev + (prev ? ' ' : '') + words[wordIndex]);
          setWordIndex(wordIndex + 1);
        }, 200); // Adjust timing as needed
        return () => clearTimeout(timer);
      }
    } else {
      setDisplayedExplanation('');
      setWordIndex(0);
    }
  }, [explanation, wordIndex]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !isAnswered && onAnswer(index + 1)}
            disabled={isAnswered}
            className={`w-full p-4 text-left rounded-md transition-colors ${
              isAnswered
                ? index + 1 === question.correctAnswer
                  ? 'bg-green-100'
                  : index + 1 === userAnswer
                  ? 'bg-red-100'
                  : 'bg-gray-50'
                : 'hover:bg-gray-100'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {isAnswered && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            {isCorrect ? (
              <>
                <CheckCircle className="text-green-500" />
                <span className="text-green-700">Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="text-red-500" />
                <span className="text-red-700">Incorrect</span>
              </>
            )}
          </div>
          {displayedExplanation && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h4 className="font-semibold mb-2">Explanation:</h4>
              <p className="whitespace-pre-wrap">{displayedExplanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;