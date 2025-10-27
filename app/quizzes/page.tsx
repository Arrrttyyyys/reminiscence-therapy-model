'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Brain, CheckCircle, XCircle, Smile } from 'lucide-react';

interface Quiz {
  id: string;
  type: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

const sampleQuizzes: Quiz[] = [
  {
    id: '1',
    type: 'nameRecall',
    question: 'Who is this person?',
    options: ['Your granddaughter Emma', 'Your daughter Sarah', 'Your sister Mary', 'Your friend Anne'],
    correctAnswer: 'Your granddaughter Emma',
  },
  {
    id: '2',
    type: 'objectRecognition',
    question: 'What is this everyday object?',
    options: ['A teacup', 'A bowl', 'A plate', 'A vase'],
    correctAnswer: 'A teacup',
  },
  {
    id: '3',
    type: 'memoryRecall',
    question: 'Where did you go on your favorite vacation?',
    options: ['The beach', 'The mountains', 'The city', 'Home'],
    correctAnswer: 'The beach',
  },
];

export default function QuizzesPage() {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);

  useEffect(() => {
    // Start with first quiz
    if (sampleQuizzes.length > 0) {
      setCurrentQuiz(sampleQuizzes[0]);
    }
  }, []);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === currentQuiz?.correctAnswer) {
      setScore(score + 1);
    }
    setTotalQuizzes(totalQuizzes + 1);
  };

  const handleNext = () => {
    const currentIndex = sampleQuizzes.findIndex(q => q.id === currentQuiz?.id);
    if (currentIndex < sampleQuizzes.length - 1) {
      setCurrentQuiz(sampleQuizzes[currentIndex + 1]);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      // Quiz complete
      setCurrentQuiz(null);
    }
  };

  if (!currentQuiz) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center border border-pink-100">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
            <p className="text-xl text-gray-600 mb-4">
              You got {score} out of {totalQuizzes} correct
            </p>
            <div className="text-4xl mb-4">
              {score === totalQuizzes ? '🎉' : score > totalQuizzes / 2 ? '🌟' : '💪'}
            </div>
            <p className="text-gray-500 mb-6">
              {score === totalQuizzes 
                ? 'Amazing! You remembered everything!' 
                : score > totalQuizzes / 2 
                ? 'Great job! Keep practicing!' 
                : 'Keep trying! Every attempt helps.'}
            </p>
            <button
              onClick={() => {
                setCurrentQuiz(sampleQuizzes[0]);
                setSelectedAnswer('');
                setShowResult(false);
                setScore(0);
                setTotalQuizzes(0);
              }}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Memory Games</h2>
          <p className="text-gray-500">Gentle exercises to keep your mind active</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-4 mb-6 border border-pink-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-semibold text-pink-600">
              {sampleQuizzes.findIndex(q => q.id === currentQuiz.id) + 1} of {sampleQuizzes.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-pink-500 to-rose-500 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${((sampleQuizzes.findIndex(q => q.id === currentQuiz.id) + 1) / sampleQuizzes.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Quiz Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-pink-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 capitalize">
                {currentQuiz.type.replace(/([A-Z])/g, ' $1').trim()} Exercise
              </h3>
              <p className="text-sm text-gray-500">Question {sampleQuizzes.findIndex(q => q.id === currentQuiz.id) + 1}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentQuiz.question}</h2>

          <div className="space-y-3 mb-6">
            {currentQuiz.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = showResult && option === currentQuiz.correctAnswer;
              const isWrong = showResult && isSelected && option !== currentQuiz.correctAnswer;

              return (
                <button
                  key={idx}
                  onClick={() => !showResult && handleAnswer(option)}
                  disabled={showResult}
                  className={`w-full text-left px-6 py-4 rounded-2xl font-medium transition-all duration-200 ${
                    isCorrect
                      ? 'bg-green-100 border-2 border-green-500 text-green-700'
                      : isWrong
                      ? 'bg-red-100 border-2 border-red-500 text-red-700'
                      : isSelected
                      ? 'bg-pink-100 border-2 border-pink-500 text-pink-700'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-pink-50 hover:border-pink-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isCorrect && <CheckCircle className="w-5 h-5" />}
                    {isWrong && <XCircle className="w-5 h-5" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-6 p-4 bg-pink-50 rounded-2xl border border-pink-200">
              <p className="text-center text-gray-700">
                {selectedAnswer === currentQuiz.correctAnswer ? (
                  <span className="flex items-center justify-center gap-2 text-green-700 font-semibold">
                    <Smile className="w-5 h-5" /> Correct! Great job! 🎉
                  </span>
                ) : (
                  <span className="text-red-700 font-semibold">
                    Not quite. The correct answer was: {currentQuiz.correctAnswer}
                  </span>
                )}
              </p>
            </div>
          )}

          {showResult && (
            <button
              onClick={handleNext}
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Next Question
            </button>
          )}
        </div>

        {/* Encouragement */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-100 mt-6">
          <p className="text-sm text-gray-700 text-center">
            💡 Take your time, there's no pressure. These exercises are here to help you remember and stay engaged.
          </p>
        </div>
      </div>
    </Layout>
  );
}

