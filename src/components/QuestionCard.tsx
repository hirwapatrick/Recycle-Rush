import React from 'react';

type Question = {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

type QuestionCardProps = {
  question: Question;
  onAnswer: (correct: boolean) => void;
};

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  return (
    <div className="p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>

      <div className="grid gap-3">
        {question.options.map((opt) => (
          <button
            key={opt}
            onClick={() => onAnswer(opt === question.answer)}
            className="p-3 rounded-md text-left border hover:bg-gray-50"
          >
            {opt}
          </button>
        ))}
      </div>

      {question.explanation && (
        <details className="mt-3 text-sm text-gray-600">
          <summary>Why?</summary>
          <p className="mt-2">{question.explanation}</p>
        </details>
      )}
    </div>
  );
}
