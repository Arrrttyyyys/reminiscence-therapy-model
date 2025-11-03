'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Brain, CheckCircle, XCircle, Smile, ArrowLeft, Play } from 'lucide-react';
import { storage } from '@/lib/storage';
import { useMLService } from '@/lib/ml/hooks';

interface Quiz {
  id: string;
  type: 'nameRecall' | 'objectRecognition' | 'memoryRecall' | 'sequenceRecall' | 'spatialRecall';
  question: string;
  options: string[];
  correctAnswer: string;
}

const quizTypes = [
  {
    id: 'nameRecall',
    name: 'Name Recall',
    icon: '👤',
    description: 'Test your ability to remember names and people',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'objectRecognition',
    name: 'Object Recognition',
    icon: '🔍',
    description: 'Identify everyday objects and their purposes',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'memoryRecall',
    name: 'Memory Recall',
    icon: '💭',
    description: 'Recall past events and experiences',
    color: 'from-green-500 to-teal-500',
  },
  {
    id: 'sequenceRecall',
    name: 'Sequence Recall',
    icon: '📋',
    description: 'Remember sequences and patterns',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'spatialRecall',
    name: 'Spatial Recall',
    icon: '🗺️',
    description: 'Remember locations and spatial relationships',
    color: 'from-indigo-500 to-purple-500',
  },
];

const quizQuestions: Record<string, Quiz[]> = {
  nameRecall: [
    {
      id: '1',
      type: 'nameRecall',
      question: 'Who is this person? (Think of a family member)',
      options: ['Your granddaughter Emma', 'Your daughter Sarah', 'Your sister Mary', 'Your friend Anne'],
      correctAnswer: 'Your granddaughter Emma',
    },
    {
      id: '2',
      type: 'nameRecall',
      question: 'What is the name of your neighbor?',
      options: ['John', 'Michael', 'Robert', 'David'],
      correctAnswer: 'John',
    },
    {
      id: '3',
      type: 'nameRecall',
      question: 'Who is your best friend from childhood?',
      options: ['Tom', 'Sarah', 'James', 'Lisa'],
      correctAnswer: 'Sarah',
    },
  ],
  objectRecognition: [
    {
      id: '1',
      type: 'objectRecognition',
      question: 'What is this everyday object used for?',
      options: ['Drinking tea', 'Holding flowers', 'Storing food', 'Writing letters'],
      correctAnswer: 'Drinking tea',
    },
    {
      id: '2',
      type: 'objectRecognition',
      question: 'What does a key open?',
      options: ['A door', 'A window', 'A book', 'A drawer'],
      correctAnswer: 'A door',
    },
    {
      id: '3',
      type: 'objectRecognition',
      question: 'What is the purpose of a calendar?',
      options: ['To tell time', 'To track dates', 'To make calls', 'To write notes'],
      correctAnswer: 'To track dates',
    },
  ],
  memoryRecall: [
    {
      id: '1',
      type: 'memoryRecall',
      question: 'Where did you go on your favorite vacation?',
      options: ['The beach', 'The mountains', 'The city', 'Home'],
      correctAnswer: 'The beach',
    },
    {
      id: '2',
      type: 'memoryRecall',
      question: 'What did you have for breakfast this morning?',
      options: ['Toast and eggs', 'Cereal', 'Fruit', 'Pancakes'],
      correctAnswer: 'Toast and eggs',
    },
    {
      id: '3',
      type: 'memoryRecall',
      question: 'What was the weather like yesterday?',
      options: ['Sunny', 'Rainy', 'Cloudy', 'Snowy'],
      correctAnswer: 'Sunny',
    },
  ],
  sequenceRecall: [
    {
      id: '1',
      type: 'sequenceRecall',
      question: 'What comes after Monday in the week?',
      options: ['Tuesday', 'Wednesday', 'Sunday', 'Friday'],
      correctAnswer: 'Tuesday',
    },
    {
      id: '2',
      type: 'sequenceRecall',
      question: 'What number comes after 5?',
      options: ['4', '6', '7', '3'],
      correctAnswer: '6',
    },
    {
      id: '3',
      type: 'sequenceRecall',
      question: 'What season comes after spring?',
      options: ['Winter', 'Summer', 'Fall', 'Autumn'],
      correctAnswer: 'Summer',
    },
  ],
  spatialRecall: [
    {
      id: '1',
      type: 'spatialRecall',
      question: 'Where do you keep your keys at home?',
      options: ['On the kitchen counter', 'In a drawer', 'By the door', 'In your pocket'],
      correctAnswer: 'On the kitchen counter',
    },
    {
      id: '2',
      type: 'spatialRecall',
      question: 'What room is next to the kitchen?',
      options: ['The living room', 'The bedroom', 'The bathroom', 'The garage'],
      correctAnswer: 'The living room',
    },
    {
      id: '3',
      type: 'spatialRecall',
      question: 'Which direction does the sun rise from?',
      options: ['North', 'South', 'East', 'West'],
      correctAnswer: 'East',
    },
  ],
};

export default function QuizzesPage() {
  const [selectedQuizType, setSelectedQuizType] = useState<string | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answerStartTime, setAnswerStartTime] = useState<number>(0);
  const { mlService } = useMLService();

  const startQuiz = (quizType: string) => {
    setSelectedQuizType(quizType);
    const quizzes = quizQuestions[quizType] || [];
    if (quizzes.length > 0) {
      setCurrentQuiz(quizzes[0]);
      setCurrentQuizIndex(0);
      setQuizStarted(true);
      setScore(0);
      setTotalQuizzes(0);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const responseLatency = answerStartTime > 0 ? Date.now() - answerStartTime : 0;
    const isCorrect = answer === currentQuiz?.correctAnswer;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    setTotalQuizzes(totalQuizzes + 1);

    // Save quiz result
    const quizScore = isCorrect ? 100 : 0;
    storage.saveQuizResult(currentQuiz?.id || '', quizScore);

    // Collect quiz signal for ML training (if consented)
    if (mlService && currentQuiz) {
      const quizType = currentQuiz.type as any;
      mlService.collectQuizSignal(
        quizType,
        isCorrect,
        responseLatency,
        0, // hintsUsed (not implemented yet)
        'medium' // difficulty (can be dynamic based on performance)
      );
    }
  };

  const handleNext = () => {
    if (!selectedQuizType) return;
    const quizzes = quizQuestions[selectedQuizType] || [];
    
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setCurrentQuiz(quizzes[currentQuizIndex + 1]);
      setSelectedAnswer('');
      setShowResult(false);
      setAnswerStartTime(Date.now()); // Start timing for next question
    } else {
      // Quiz complete
      setQuizStarted(false);
    }
  };

  useEffect(() => {
    if (currentQuiz && !showResult) {
      setAnswerStartTime(Date.now());
    }
  }, [currentQuiz, showResult]);

  const resetQuiz = () => {
    setSelectedQuizType(null);
    setCurrentQuiz(null);
    setCurrentQuizIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
    setTotalQuizzes(0);
    setQuizStarted(false);
  };

  // Show quiz type selection
  if (!quizStarted) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6 pb-32 fade-in">
          {/* Header */}
          <div className="mb-6 slide-up">
            <h2 className="text-3xl font-bold text-white mb-2">Memory Games</h2>
            <p className="text-gray-400">Choose a type of memory exercise to begin</p>
          </div>

          {/* Quiz Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => startQuiz(type.id)}
                className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 hover:border-teal-500/50 hover:shadow-xl transition-all duration-300 text-left card-hover group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center mb-4 text-3xl group-hover:scale-110 transition-transform`}>
                  {type.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{type.name}</h3>
                <p className="text-sm text-gray-400">{type.description}</p>
                <div className="mt-4 flex items-center gap-2 text-teal-400 group-hover:text-teal-300 transition-colors">
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-medium">Start Exercise</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Show quiz completion screen
  if (!currentQuiz && quizStarted) {
    const selectedType = quizTypes.find(t => t.id === selectedQuizType);
    return (
      <Layout>
        <div className="max-w-2xl mx-auto pb-32 fade-in">
          <div className="bg-gray-900/50 border border-teal-500/30 rounded-3xl p-8 text-center slide-up">
            <div className={`w-20 h-20 bg-gradient-to-br ${selectedType?.color || 'from-teal-500 to-cyan-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
            <p className="text-xl text-gray-300 mb-4">
              You got {score} out of {totalQuizzes} correct
            </p>
            <div className="text-4xl mb-4">
              {score === totalQuizzes ? '🎉' : score > totalQuizzes / 2 ? '🌟' : '💪'}
            </div>
            <p className="text-gray-400 mb-6">
              {score === totalQuizzes 
                ? 'Amazing! You remembered everything!' 
                : score > totalQuizzes / 2 
                ? 'Great job! Keep practicing!' 
                : 'Keep trying! Every attempt helps.'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
              >
                Choose Different Game
              </button>
              <button
                onClick={() => startQuiz(selectedQuizType || '')}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show current quiz question
  if (!selectedQuizType || !currentQuiz) return null;

  const quizzes = quizQuestions[selectedQuizType] || [];
  const selectedType = quizTypes.find(t => t.id === selectedQuizType);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6 pb-32 fade-in">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6 slide-up">
          <button
            onClick={resetQuiz}
            className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-teal-500/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white">Memory Games</h2>
            <p className="text-gray-400 text-sm">{selectedType?.name}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-4 slide-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-400">Progress</span>
            <span className="text-sm font-semibold text-teal-400">
              {currentQuizIndex + 1} of {quizzes.length}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-teal-500 to-cyan-600 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuizIndex + 1) / quizzes.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Quiz Card */}
        <div className="bg-gray-900/50 border border-teal-500/30 rounded-3xl shadow-lg p-8 slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-14 h-14 bg-gradient-to-br ${selectedType?.color || 'from-teal-500 to-cyan-600'} rounded-xl flex items-center justify-center text-2xl`}>
              {selectedType?.icon || '🧠'}
            </div>
            <div>
              <h3 className="font-semibold text-white capitalize">
                {selectedType?.name || currentQuiz.type} Exercise
              </h3>
              <p className="text-sm text-gray-400">Question {currentQuizIndex + 1}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">{currentQuiz.question}</h2>

          <div className="space-y-3 mb-6">
            {currentQuiz.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = showResult && option === currentQuiz.correctAnswer;
              const isWrong = showResult && isSelected && option !== currentQuiz.correctAnswer;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (!showResult) {
                      setAnswerStartTime(Date.now());
                      handleAnswer(option);
                    }
                  }}
                  disabled={showResult}
                  className={`w-full text-left px-6 py-4 rounded-2xl font-medium transition-all duration-200 ${
                    isCorrect
                      ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                      : isWrong
                      ? 'bg-red-500/20 border-2 border-red-500 text-red-400'
                      : isSelected
                      ? 'bg-teal-500/20 border-2 border-teal-500 text-teal-400'
                      : 'bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 hover:border-teal-500/50 text-white'
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
            <div className="mb-6 p-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl">
              <p className="text-center text-white">
                {selectedAnswer === currentQuiz.correctAnswer ? (
                  <span className="flex items-center justify-center gap-2 text-green-400 font-semibold">
                    <Smile className="w-5 h-5" /> Correct! Great job! 🎉
                  </span>
                ) : (
                  <span className="text-red-400 font-semibold">
                    Not quite. The correct answer was: <span className="text-green-400">{currentQuiz.correctAnswer}</span>
                  </span>
                )}
              </p>
            </div>
          )}

          {showResult && (
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {currentQuizIndex < quizzes.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          )}
        </div>

        {/* Encouragement */}
        <div className="bg-gradient-to-r from-teal-900/20 to-cyan-900/20 border border-teal-500/30 rounded-2xl p-5 slide-up">
          <p className="text-sm text-gray-300 text-center">
            💡 Take your time, there's no pressure. These exercises are here to help you remember and stay engaged.
          </p>
        </div>
      </div>
    </Layout>
  );
}