import React, { useEffect, useState } from 'react';
import QuestionCard, { Question } from './QuestionCard';

type QuizPlayerProps = {
  topic: string;
  onBack: () => void;
};

export default function QuizPlayer({ topic, onBack }: QuizPlayerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  // Track all selected answers by index
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);

  useEffect(() => {
    fetch('/data/questions.json')
      .then((r) => r.json())
      .then((data) => {
        const qs = data[topic] || [];
        setQuestions(qs);
        setIndex(0);
        setScore(0);
        setSelectedAnswers(new Array(qs.length).fill(null));
      })
      .catch((err) => console.error('Failed to load questions:', err));
  }, [topic]);

  const answered = selectedAnswers[index] !== null;

  function handleAnswer(correct: boolean, selectedOption: string) {
    if (answered) return;

    setSelectedAnswers((prev) => {
      const copy = [...prev];
      copy[index] = selectedOption;
      return copy;
    });

    if (correct) setScore((s) => s + 1);
  }

  function handleNext() {
    setIndex((i) => Math.min(i + 1, questions.length - 1));
  }

  function handlePrevious() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  if (!questions.length)
    return (
      <div>
        <button onClick={onBack} className="mb-4">
          ← Back
        </button>
        <div>No questions found for this topic.</div>
      </div>
    );

  if (index >= questions.length)
    return (
      <div className="text-center">
        <button onClick={onBack} className="mb-4">
          ← Back
        </button>
        <h2 className="text-2xl font-bold">Finished!</h2>
        <p>
          Your score: {score} / {questions.length}
        </p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-green-50 rounded-xl shadow">
      <button onClick={onBack} className="mb-4 text-green-700 hover:underline">
        ← Back
      </button>

      <QuestionCard
        question={questions[index]}
        onAnswer={handleAnswer}
        answered={answered}
        selectedOption={selectedAnswers[index] || null} // show previous selection
      />

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
      </div>

      <div className="mt-4 text-green-800">
        Progress: {index + 1} / {questions.length}
      </div>
    </div>
  );
}
