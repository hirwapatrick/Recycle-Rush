import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Lottie from 'lottie-react';
import Confetti from 'react-confetti';
import correctAnim from '../anime/correct.json';
import wrongAnim from '../anime/incorrect.json';

export type Option = { label: string; image: string };
export type Question = { question: string; options: Option[]; answer: string };

type QuestionCardProps = {
  question: Question;
  onAnswer: (correct: boolean, selectedOption: string) => void;
};

type DragItem = { label: string };

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnim, setShowAnim] = useState<'correct' | 'wrong' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Reset state when question changes
    setAnswered(false);
    setSelectedOption(null);
    setShowAnim(null);
    setShowConfetti(false);
  }, [question]);

  const handleDrop = (item: DragItem) => {
    if (answered) return;

    const correct = item.label === question.answer;
    setAnswered(true);
    setSelectedOption(item.label);
    setShowAnim(correct ? 'correct' : 'wrong');
    if (correct) setShowConfetti(true);

    onAnswer(correct, item.label);

    setTimeout(() => setShowAnim(null), 1500);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const [{ isOver }, drop] = useDrop({
    accept: 'option',
    drop: (item: DragItem) => handleDrop(item),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  });

  return (
    <div className="relative p-6 rounded-xl border-2 border-green-300 bg-green-50 shadow-lg max-w-xl mx-auto overflow-hidden">
      {showConfetti && <Confetti numberOfPieces={100} recycle={false} />}
      {showAnim && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="w-40 h-40">
            <Lottie animationData={showAnim === 'correct' ? correctAnim : wrongAnim} loop={false} />
          </div>
        </div>
      )}

      <h3 className="text-lg font-bold mb-6 text-green-800">{question.question}</h3>

      <div
        ref={drop}
        className={`p-6 border-4 border-dashed rounded-lg mb-6 flex justify-center items-center text-xl ${
          isOver ? 'border-green-600 bg-green-100' : 'border-gray-300 bg-white'
        }`}
      >
        {answered
          ? selectedOption === question.answer
            ? '✅ Correct!'
            : `❌ Wrong! Correct: ${question.answer}`
          : 'Drop your answer here'}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {question.options.map((opt) => (
          <DraggableOption key={opt.label} label={opt.label} image={opt.image} answered={answered} />
        ))}
      </div>
    </div>
  );
}

// ----------------- Draggable Option -----------------
function DraggableOption({ label, image, answered }: { label: string; image: string; answered: boolean }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'option',
    item: { label },
    canDrag: !answered,
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  });

  return (
    <div
      ref={drag}
      className={`p-2 bg-green-200 rounded-lg cursor-move hover:scale-105 transform transition flex flex-col items-center gap-1 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <img src={image} alt={label} className="w-20 h-20 object-contain rounded-lg shadow" />
      <span className="text-center text-sm font-semibold">{label}</span>
    </div>
  );
}
