import React, { useEffect, useState } from 'react';
import QuestionCard, { Question } from './QuestionCard';
import { motion, AnimatePresence } from 'framer-motion';

type QuizPlayerProps = {
  topic: string;
  onBack: () => void;
};

export default function QuizPlayer({ topic, onBack }: QuizPlayerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(60); // 1 min per quiz
  const [finished, setFinished] = useState<boolean>(false);

  // Load questions for the selected topic
  useEffect(() => {
    fetch('/data/questions.json')
      .then((r) => r.json())
      .then((data) => {
        const qs = data[topic] || [];
        setQuestions(qs);
        setIndex(0);
        setScore(0);
        setFinished(false);
        setSelectedAnswers(new Array(qs.length).fill(null));
        setTimeLeft(60);
      })
      .catch((err) => console.error('Failed to load questions:', err));
  }, [topic]);

  // Timer countdown
  useEffect(() => {
    if (finished || !questions.length) return;
    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, finished, questions]);

  const answered = selectedAnswers[index] !== null;

  function handleAnswer(correct: boolean, selectedOption: string) {
    if (answered || finished) return;

    setSelectedAnswers((prev) => {
      const copy = [...prev];
      copy[index] = selectedOption;
      return copy;
    });

    if (correct) setScore((s) => s + 1);
  }

  function handleNext() {
    if (index < questions.length - 1) setIndex((i) => i + 1);
    else setFinished(true);
  }

  function handlePrevious() {
    if (index > 0) setIndex((i) => i - 1);
  }

  // When quiz finished
  if (finished || index >= questions.length)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-lg mx-auto bg-green-50 p-6 rounded-xl shadow"
      >
        <button
          onClick={onBack}
          className="mb-4 text-green-700 hover:underline"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold mb-3">Quiz Finished!</h2>
        <p className="text-lg mb-2">
          Your score: <span className="font-semibold">{score}</span> /{' '}
          {questions.length}
        </p>
        <p className="text-green-700 mb-4">
          Accuracy:{' '}
          {questions.length
            ? ((score / questions.length) * 100).toFixed(1)
            : 0}
          %
        </p>

        <div className="bg-white rounded-lg p-3 shadow-inner text-left">
          <h3 className="font-semibold mb-2">Your Answers:</h3>
          {questions.map((q, i) => (
            <div
              key={i}
              className={`p-2 rounded mb-1 ${
                q.answer === selectedAnswers[i]
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}
            >
              <span className="font-medium">
                Q{i + 1}: {q.question}
              </span>
              <div className="text-sm ml-3">
                Your: {selectedAnswers[i] || '—'} | Correct:{' '}
                {q.answer}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );

  if (!questions.length)
    return (
      <div className="text-center p-6">
        <button onClick={onBack} className="mb-4 text-green-700 hover:underline">
          ← Back
        </button>
        <div>No questions found for this topic.</div>
      </div>
    );

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto p-6 bg-green-50 rounded-xl shadow"
    >
      <button onClick={onBack} className="mb-4 text-green-700 hover:underline">
        ← Back
      </button>

      <AnimatePresence mode="wait">
        <QuestionCard
          key={index}
          question={questions[index]}
          onAnswer={handleAnswer}
          answered={answered}
          selectedOption={selectedAnswers[index] || null}
        />
      </AnimatePresence>

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded shadow hover:bg-gray-400 transition"
          disabled={index === 0}
        >
          ← Previous
        </button>

        {answered && index < questions.length - 1 && (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
          >
            Next →
          </button>
        )}

        {answered && index === questions.length - 1 && (
          <button
            onClick={() => setFinished(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          >
            Finish
          </button>
        )}
      </div>

      <div className="mt-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500"
            style={{
              width: `${((index + 1) / questions.length) * 100}%`,
            }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex justify-between text-sm mt-2 text-green-700">
          <span>
            Progress: {index + 1} / {questions.length}
          </span>
          <span>Time left: {timeLeft}s</span>
        </div>
      </div>
    </motion.div>
  );
}
