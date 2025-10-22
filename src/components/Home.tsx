//Home.tsx
import { useState } from "react";
import { FaRecycle, FaBolt, FaTree, FaWater, FaLock } from "react-icons/fa";
import Lotties from "./Lotties";
import LevelSelector from "./LevelSelector";
import bird from "../anime/running pigeon.json";

type Topic = { id: string; name: string; icon: JSX.Element };
type HomeProps = {
  onStartQuiz: (topic: string, level: number) => void;
  progress?: { [topic: string]: number }; // last completed levels per topic
};

const topics: Topic[] = [
  { id: "waste_management", name: "Waste Management", icon: <FaRecycle /> },
  { id: "energy_conservation", name: "Energy Conservation", icon: <FaBolt /> },
  { id: "tree_planting", name: "Tree Planting & Biodiversity", icon: <FaTree /> },
  { id: "water_conservation", name: "Water Conservation", icon: <FaWater /> },
];

export default function Home({ onStartQuiz, progress = {} }: HomeProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  if (selectedTopic)
    return (
      <div className="flex flex-col items-center">
        <LevelSelector
          topic={selectedTopic}
          lastCompletedLevel={progress[selectedTopic] || 0}
          onSelectLevel={(topic, level) => onStartQuiz(topic, level)}
        />
        <button
          onClick={() => setSelectedTopic(null)}
          className="mt-6 px-4 py-2 bg-green-200 text-green-800 rounded-lg shadow hover:bg-green-300"
        >
          ← Back to Topics
        </button>
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-10">
      <Lotties animationData={bird} />
      <div className="flex-1 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-semibold mb-6 text-green-800 animate-pulse">
          Leave the world clean, Recycle Rush
        </h1>
        <p className="mb-6 text-green-700">
          Choose a topic to start learning through interactive mini-games and quizzes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {topics.map((t, idx) => {
            // First topic is always unlocked, others unlocked if previous topic has all 5 levels completed
            const unlocked =
              idx === 0 || (progress[topics[idx - 1].id] || 0) === 5;

            return (
              <button
                key={t.id}
                onClick={() => unlocked && setSelectedTopic(t.id)}
                className={`p-6 rounded-2xl border-2 border-green-300 ${
                  unlocked
                    ? "bg-green-50 hover:bg-green-100 hover:shadow-xl transform hover:scale-105"
                    : "bg-gray-300 cursor-not-allowed opacity-60"
                } transition-all duration-300 flex flex-col items-center gap-4`}
              >
                <div className="text-5xl text-green-600 animate-bounce">
                  {unlocked ? t.icon : <FaLock />}
                </div>
                <h2 className="text-xl font-semibold text-green-800">{t.name}</h2>
                <p className="text-sm mt-1 text-green-600">
                  {unlocked ? "Tap to start" : "Locked"}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
