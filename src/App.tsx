import { useState } from 'react';
import { FaLeaf } from 'react-icons/fa';
import Home from './components/Home';
import QuizPlayer from './components/QuizPlayer';

type View = 'home' | 'quiz';

export default function App(): JSX.Element {
  const [view, setView] = useState<View>('home');
  const [topic, setTopic] = useState<string | null>(null);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-green-100 via-green-50 to-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-green-200 shadow-lg">
        <h1 className="text-3xl font-extrabold text-green-900 flex items-center gap-2 animate-pulse">
          <FaLeaf className="text-green-700" /> Green Quiz Game
        </h1>
        {view === 'quiz' && (
          <button
            onClick={() => setView('home')}
            className="px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition"
          >
            ← Back
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-start pt-4 px-4">
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

      {/* Footer (Optional: could show progress / score summary) */}
      {view === 'quiz' && (
        <footer className="bg-green-100 p-3 flex justify-between items-center text-green-900 font-semibold shadow-inner">
          <span>🍀 Keep learning and have fun!</span>
          <span>💎 Score Tracker</span>
        </footer>
      )}
    </div>
  );
}
