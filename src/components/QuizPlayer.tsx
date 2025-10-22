import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion'; 
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import QuestionCard, { Question } from './QuestionCard';
import Confetti from 'react-confetti';
import Lottie from 'lottie-react';
import trophyAnim from '../anime/trophy.json';

type QuizPlayerProps = {
  topic: string;
  level: number;
  onBack: () => void;
  onNextLevel: () => void;
  onRetry: () => void; 
};

export default function QuizPlayer({ topic, level, onBack, onNextLevel }: QuizPlayerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const loadLevelQuestions = useCallback(() => {
    fetch('/data/questions.json')
      .then((r) => r.json())
      .then((data) => {
        const levelData = data[topic]?.[level - 1];
        const levelQuestions = levelData?.questions || [];
        setQuestions(levelQuestions);
        setIndex(0);
        setScore(0);
        setFinished(false);
      });
  }, [topic, level]);

  useEffect(() => {
    loadLevelQuestions();
  }, [loadLevelQuestions]);

  const handleAnswer = (correct: boolean) => {
  if (correct) setScore((s) => s + 1);

  setTimeout(() => {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  }, 500);
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
    let message = '',
      badge = '';

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
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 120 }} className="w-56 h-56 mb-6">
          <Lottie animationData={trophyAnim} loop={false} />
        </motion.div>
        <h2 className="text-4xl font-bold mb-2 text-green-800 flex items-center gap-2 justify-center text-center">
          {badge} You Finished!
        </h2>
        <p className="text-xl mb-4 text-center">{message}</p>
        <div className="flex items-center gap-2 text-2xl mb-4">
          Score: {score}/{questions.length} 💎 ({Math.round(percentage)}%)
        </div>
        <div className="flex gap-4 mt-6">
          {passed && <button onClick={onNextLevel} className="px-6 py-3 rounded-full bg-green-600 text-white text-xl shadow-lg hover:bg-green-700 transition-all">▶ Next Level</button>}
          {!passed && <button onClick={loadLevelQuestions} className="px-6 py-3 rounded-full bg-yellow-600 text-white text-xl shadow-lg hover:bg-yellow-700 transition-all">🔄 Retry Level</button>}
          <button onClick={onBack} className="px-6 py-3 rounded-full bg-green-400 text-white text-xl shadow-lg hover:bg-green-500 transition-all">🏠 Back Home</button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen justify-center p-4 bg-gradient-to-b from-green-50 to-white overflow-hidden">
        <QuestionCard question={questions[index]} onAnswer={handleAnswer} />
      </div>
    </DndProvider>
  );
}
