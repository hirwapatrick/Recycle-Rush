import { useEffect, useState, useCallback } from 'react';
import QuestionCard, { Question } from './QuestionCard';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import trophyAnim from '../anime/trophy.json';
import Confetti from 'react-confetti';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type QuizPlayerProps = {
  topic: string;
  level: number;
  onBack: () => void;
  onNextLevel: () => void;
  onRetry: () => void;
};

export default function QuizPlayer({
  topic,
  level,
  onBack,
  onNextLevel,
}: QuizPlayerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [finished, setFinished] = useState(false);

  // Load questions for the level
  const loadLevelQuestions = useCallback(() => {
    fetch('/data/questions.json')
      .then(r => r.json())
      .then(data => {
        const qs = data[topic]?.[level - 1] || []; // questions for current level
        const levelQuestions = qs.slice(0, 5);
        setQuestions(levelQuestions);
        setIndex(0);
        setScore(0);
        setFinished(false);
        setSelectedAnswers(new Array(levelQuestions.length).fill(null));
        setTimeLeft(60);
      });
  }, [topic, level]);

  useEffect(() => {
    loadLevelQuestions();
  }, [loadLevelQuestions]);

  // Timer
  useEffect(() => {
    if (finished || !questions.length) return;
    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, finished, questions]);

  const handleAnswer = (correct: boolean, selectedOption: string) => {
    if (finished || selectedAnswers[index]) return;

    const updated = [...selectedAnswers];
    updated[index] = selectedOption;
    setSelectedAnswers(updated);

    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (index < questions.length - 1) setIndex(i => i + 1);
      else setFinished(true);
    }, 800);
  };

  const handleNext = () => {
    onNextLevel();
  };

  // UPDATED retry: resets everything for current level
  const handleRetryLevel = () => {
    loadLevelQuestions(); // reload same level questions
  };

  if (!questions.length)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <button onClick={onBack} className="mb-4 text-green-700 hover:underline">
          ← Back
        </button>
        <p>Loading questions...</p>
      </div>
    );

  if (finished) {
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 70;

    let message = '';
    let badge = '';

    if (percentage >= 90) {
      message = '🎉 Excellent! You are a Green Hero!';
      badge = '🥇';
    } else if (percentage >= 70) {
      message = '👍 Good job! Keep learning!';
      badge = '🥈';
    } else {
      message = '💡 Keep it up! Keep learning and practicing!';
      badge = '🥉';
    }

    return (
      <div className="relative flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-b from-green-100 to-green-50 p-6 overflow-hidden">
        <Confetti numberOfPieces={200} recycle={false} />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 120 }}
          className="w-56 h-56 mb-6"
        >
          <Lottie animationData={trophyAnim} loop={false} />
        </motion.div>

        <motion.h2
          className="text-4xl font-bold mb-2 text-green-800 flex items-center gap-2 justify-center text-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {badge} You Finished!
        </motion.h2>

        <p className="text-xl mb-4 text-center">{message}</p>
        <div className="flex items-center gap-2 text-2xl mb-4">
          Score: {score}/{questions.length} 💎 ({Math.round(percentage)}%)
        </div>

        <motion.div className="grid grid-cols-4 gap-2 w-full max-w-sm">
          {questions.map((q, i) => (
            <motion.div
              key={i}
              className={`flex justify-center items-center text-2xl p-3 rounded-xl shadow ${
                selectedAnswers[i] === q.answer ? 'bg-green-200' : 'bg-red-200'
              }`}
              whileHover={{ scale: 1.1 }}
            >
              {selectedAnswers[i] === q.answer ? '✅' : '❌'}
            </motion.div>
          ))}
        </motion.div>

        <div className="flex gap-4 mt-6">
          {passed && (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-full bg-green-600 text-white text-xl shadow-lg hover:bg-green-700 transition-all"
            >
              ▶ Next Level
            </button>
          )}
          {!passed && (
            <button
              onClick={handleRetryLevel}
              className="px-6 py-3 rounded-full bg-yellow-600 text-white text-xl shadow-lg hover:bg-yellow-700 transition-all"
            >
              🔄 Retry Level
            </button>
          )}
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-full bg-green-400 text-white text-xl shadow-lg hover:bg-green-500 transition-all"
          >
            🏠 Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen justify-between p-4 bg-gradient-to-b from-green-50 to-white overflow-hidden">
        <div className="flex justify-between items-center mb-2 text-lg font-bold text-green-800">
          <div className="flex items-center gap-2">⏳ {timeLeft}s</div>
          <div className="flex items-center gap-2">💎 {score}</div>
          <div className="flex-1 mx-2 h-2 bg-gray-200 rounded overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              animate={{ width: `${((index + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {questions[index] && (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100, rotate: 5, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, rotate: -5, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="w-full flex justify-center max-w-xl"
              >
                <QuestionCard
                  question={questions[index]}
                  onAnswer={handleAnswer}
                  answered={!!selectedAnswers[index]}
                  selectedOption={selectedAnswers[index] || null}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DndProvider>
  );
}
