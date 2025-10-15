import React, { useState } from 'react';
import Home from './components/Home';
import QuizPlayer from './components/QuizPlayer';

type View = 'home' | 'quiz';

export default function App(): JSX.Element {
  const [view, setView] = useState<View>('home');
  const [topic, setTopic] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-green-50 to-white">
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
    </div>
  );
}
