import React, { useEffect, useState } from 'react';
import QuestionCard from './QuestionCard';


type Question = {
  question: string;
  options: string[];
  answer: string;
};

type QuizPlayerProps = {
  topic: string;
  onBack: () => void;
};

export default function QuizPlayer({ topic, onBack }: QuizPlayerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    // load local json
    fetch('/src/data/questions.json')
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data[topic] || []);
        setIndex(0);
        setScore(0);
      })
      .catch((err) => console.error('Failed to load questions:', err));
  }, [topic]);

  function handleAnswer(correct: boolean) {
    if (correct) setScore((s) => s + 1);
    setIndex((i) => i + 1);
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
      <div>
        <button onClick={onBack} className="mb-4">
          ← Back
        </button>
        <h2 className="text-2xl">Finished!</h2>
        <p>
          Your score: {score} / {questions.length}
        </p>
        <div className="mt-4">{/* TODO: show Lottie celebration */}</div>
      </div>
    );

  return (
    <div>
      <button onClick={onBack} className="mb-4">
        ← Back
      </button>
      <div className="max-w-2xl mx-auto">
        <QuestionCard question={questions[index]} onAnswer={handleAnswer} />
        <div className="mt-4">
          Progress: {index + 1} / {questions.length}
        </div>
      </div>
    </div>
  );
}
