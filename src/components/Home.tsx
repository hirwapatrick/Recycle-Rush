import React from 'react';
import { FaRecycle, FaBolt, FaTree, FaWater } from 'react-icons/fa';

type Topic = {
  id: string;
  name: string;
  icon: JSX.Element;
};

type HomeProps = {
  onSelectTopic: (topicId: string) => void;
};

const topics: Topic[] = [
  { id: 'waste_management', name: 'Waste Management', icon: <FaRecycle /> },
  { id: 'energy_conservation', name: 'Energy Conservation', icon: <FaBolt /> },
  { id: 'tree_planting', name: 'Tree Planting & Biodiversity', icon: <FaTree /> },
  { id: 'water_conservation', name: 'Water Conservation', icon: <FaWater /> },
];

export default function Home({ onSelectTopic }: HomeProps) {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6 text-green-800 animate-pulse">
        🌿⚠️ Recycle Rush — The Green Skills Challenge
      </h1>
      <p className="mb-6 text-green-700">
        Choose a topic to start learning through interactive mini-games and quizzes.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelectTopic(t.id)}
            className="p-6 rounded-2xl border-2 border-green-300 bg-green-50 hover:bg-green-100 hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex flex-col items-center gap-4"
          >
            <div className="text-5xl text-green-600 animate-bounce">{t.icon}</div>
            <h2 className="text-xl font-semibold text-green-800">{t.name}</h2>
            <p className="text-sm mt-1 text-green-600">Tap to start</p>
          </button>
        ))}
      </div>
    </div>
  );
}
