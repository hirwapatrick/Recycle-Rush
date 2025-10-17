//QuestionCard.tsx
import { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Lottie from 'lottie-react';
import Confetti from 'react-confetti';
import correctAnim from '../anime/correct.json';
import wrongAnim from '../anime/incorrect.json';

export type Question = {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

type QuestionCardProps = {
  question: Question;
  onAnswer: (correct: boolean, selectedOption: string) => void;
  answered: boolean;
  selectedOption?: string | null; // <- add this line
};

type DragItem = {
  text: string;
};

export default function QuestionCard({ question, onAnswer, answered }: QuestionCardProps) {
  const [showAnim, setShowAnim] = useState<'correct' | 'wrong' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowAnim(null);
    setShowConfetti(false);
  }, [question]);

  const handleDrop = (item: DragItem) => {
    if (answered) return;
    const correct = item.text === question.answer;
    onAnswer(correct, item.text);
    if (correct) {
      setShowAnim('correct');
      setShowConfetti(true);
      setTimeout(() => setShowAnim(null), 1500);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setShowAnim('wrong');
      setTimeout(() => setShowAnim(null), 1500);
    }
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
        {answered ? question.answer : 'Drop your answer here'}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {question.options.map((opt) => (
          <DraggableOption key={opt} text={opt} answered={answered} />
        ))}
      </div>
    </div>
  );
}

function DraggableOption({ text, answered }: { text: string; answered: boolean }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'option',
    item: { text },
    canDrag: !answered,
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  });

  return (
    <div
      ref={drag}
      className={`p-4 bg-green-200 rounded-lg cursor-move hover:scale-105 transform transition ${
        isDragging ? 'opacity-50' : ''
      } text-lg font-semibold`}
    >
      {text}
    </div>
  );
}
