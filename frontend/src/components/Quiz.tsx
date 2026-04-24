import { useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const quizQuestions: QuizQuestion[] = [
  {
    question: "What's the birthday girl's favorite color?",
    options: ['Pink', 'Purple', 'Blue', 'Green'],
    correctAnswer: 0,
  },
  {
    question: "What's her dream vacation destination?",
    options: ['Paris', 'Tokyo', 'New York', 'Bali'],
    correctAnswer: 1,
  },
  {
    question: "What's her go-to karaoke song?",
    options: ['Dancing Queen', 'Total Eclipse of the Heart', 'I Will Survive', 'Wannabe'],
    correctAnswer: 2,
  },
  {
    question: "What's her favorite type of cake?",
    options: ['Chocolate', 'Vanilla', 'Red Velvet', 'Funfetti'],
    correctAnswer: 3,
  },
  {
    question: "What does she order at a coffee shop?",
    options: ['Cappuccino', 'Latte', 'Iced Coffee', 'Mocha'],
    correctAnswer: 1,
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    if (answered) return;

    setSelectedAnswer(answerIndex);
    setAnswered(true);

    if (answerIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
  };

  if (showResult) {
    return (
      <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-pink-300 text-center">
        <h2 className="mb-3 sm:mb-4">Quiz Complete! 🎊</h2>
        <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">
          {score >= 4 ? '🏆' : score >= 3 ? '⭐' : '💖'}
        </div>
        <p className="text-xl sm:text-2xl mb-4 sm:mb-6">
          You scored {score} out of {quizQuestions.length}!
        </p>
        <p className="text-base sm:text-lg mb-4 sm:mb-6 text-purple-700">
          {score >= 4
            ? "You know the birthday girl so well! 💕"
            : score >= 3
            ? "Pretty good! You're a great friend! 🌟"
            : "Time to get to know her better! 😊"}
        </p>
        <button
          onClick={resetQuiz}
          className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full hover:from-pink-500 hover:to-purple-500 active:scale-95 transition-all shadow-lg touch-manipulation"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-pink-300">
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-3 sm:mb-4 text-sm sm:text-base">
          <span className="text-pink-600">
            Question {currentQuestion + 1}/{quizQuestions.length}
          </span>
          <span className="text-purple-600">Score: {score}</span>
        </div>
        <div className="w-full bg-pink-200 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3 className="mb-4 sm:mb-6 text-center">{quizQuestions[currentQuestion].question}</h3>

      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        {quizQuestions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={answered}
            className={`w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 border-2 touch-manipulation active:scale-95 ${
              answered
                ? index === quizQuestions[currentQuestion].correctAnswer
                  ? 'bg-green-400 border-green-500 text-white'
                  : index === selectedAnswer
                  ? 'bg-red-400 border-red-500 text-white'
                  : 'bg-white border-pink-200 opacity-50'
                : 'bg-white border-pink-300 hover:border-pink-400 hover:shadow-lg'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {answered && (
        <button
          onClick={nextQuestion}
          className="w-full px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full hover:from-pink-500 hover:to-purple-500 active:scale-95 transition-all shadow-lg touch-manipulation"
        >
          {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
        </button>
      )}
    </div>
  );
}
