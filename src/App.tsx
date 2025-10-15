import React, { useState } from 'react';
import { FaLeaf } from 'react-icons/fa';
import Home from './components/Home';
import QuizPlayer from './components/QuizPlayer';

type View = 'home' | 'quiz';

export default function App(): JSX.Element {
  const [view, setView] = useState<View>('home');
  const [topic, setTopic] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-green-100 via-green-50 to-white transition-colors duration-700">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2 animate-pulse">
          <FaLeaf className="text-green-600" /> Green Quiz Game
        </h1>
        {view === 'quiz' && (
          <button
            onClick={() => setView('home')}
            className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
          >
            Back
          </button>
        )}
      </header>

      <main className="flex justify-center items-start">
        {view === 'home' && (
          <Home
            onSelectTopic={(t: string) => {
              setTopic(t);
              setView('quiz');
            }}
          />
        )}

        {view === 'quiz' && topic && (
          <QuizPlayer topic={topic} onBack={() => setView('home')} />
        )}
      </main>
    </div>
  );
}
