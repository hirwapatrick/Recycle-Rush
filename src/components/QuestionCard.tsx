import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Confetti from 'react-confetti';

export type Question = {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

type QuestionCardProps = {
  question: Question;
  onAnswer: (correct: boolean, selectedOption: string) => void;
  answered: boolean; // controlled from parent
  selectedOption?: string | null; // previously selected
};

export default function QuestionCard({
  question,
  onAnswer,
  answered,
  selectedOption,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Reset selection when question changes
    setSelected(selectedOption ?? null);
    setShowConfetti(false);
  }, [question, selectedOption]);

  const handleClick = (option: string) => {
    if (answered || selected) return;

    setSelected(option);
    const correct = option === question.answer;
    onAnswer(correct, option);

    if (correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const currentSelection = selected;
  const isCorrect = currentSelection === question.answer;

  return (
    <div className="p-6 rounded-xl border-2 border-green-300 bg-green-50 shadow-lg max-w-xl mx-auto">
      {showConfetti && <Confetti numberOfPieces={100} recycle={false} />}
      <h3 className="text-lg font-bold mb-4 text-green-800">{question.question}</h3>

      <div className="grid gap-3">
        {question.options.map((opt) => {
          const isSelected = currentSelection === opt;
          let bgColor = 'bg-green-100 hover:bg-green-200';

          if (answered || currentSelection) {
            if (isSelected && opt === question.answer) bgColor = 'bg-green-400 text-white';
            else if (isSelected && opt !== question.answer) bgColor = 'bg-red-400 text-white';
            else if (opt === question.answer) bgColor = 'bg-green-300 text-white';
            else bgColor = 'bg-green-100';
          }

          return (
            <button
              key={opt}
              onClick={() => handleClick(opt)}
              className={`p-3 rounded-lg border border-green-300 font-semibold flex items-center gap-2 transition transform hover:scale-105 ${bgColor}`}
              disabled={!!selectedOption} // disable for previous questions
            >
              {(answered || currentSelection) && isSelected && opt === question.answer && (
                <FaCheckCircle className="text-white" />
              )}
              {(answered || currentSelection) && isSelected && opt !== question.answer && (
                <FaTimesCircle className="text-white" />
              )}
              {opt}
            </button>
          );
        })}
      </div>

      {(answered || currentSelection) && !isCorrect && question.explanation && (
        <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-400 rounded">
          <p className="text-sm text-green-800">Hint: {question.explanation}</p>
        </div>
      )}
    </div>
  );
}
