import React from 'react';

type Topic = {
  id: string;
  name: string;
};

type HomeProps = {
  onSelectTopic: (topicId: string) => void;
};

const topics: Topic[] = [
  { id: 'waste_management', name: 'Waste Management' },
  { id: 'energy_conservation', name: 'Energy Conservation' },
  { id: 'tree_planting', name: 'Tree Planting & Biodiversity' },
  { id: 'water_conservation', name: 'Water Conservation' },
];

export default function Home({ onSelectTopic }: HomeProps) {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">EcoQuest — The Green Challenge</h1>
      <p className="mb-6">
        Choose a topic to start learning through interactive mini-games and quizzes.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelectTopic(t.id)}
            className="p-6 rounded-xl border hover:shadow"
          >
            <h2 className="text-xl font-semibold">{t.name}</h2>
            <p className="text-sm mt-2 text-gray-600">Tap to start</p>
          </button>
        ))}
      </div>
    </div>
  );
}
