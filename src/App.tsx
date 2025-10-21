import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import ecologyAnim from "./anime/Ecology.json";
import Home from "./components/Home";
import QuizPlayer from "./components/QuizPlayer";
import {
  Airdrop,
  Aquarius,
  Bezier,
  Tree,
  OceanProtocol,
  Star1,
  Flash,
  Drop,
  Avalanche,
  Award,
  AirplaneSquare,
} from "iconsax-reactjs";

type View = "landing" | "home" | "quiz";

// Track completed levels per topic
type Progress = { [topic: string]: number };

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [topic, setTopic] = useState<string | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [progress, setProgress] = useState<Progress>({});

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("green_quiz_progress");
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("green_quiz_progress", JSON.stringify(progress));
  }, [progress]);

  const handleStartQuiz = (selectedTopic: string, selectedLevel: number) => {
    setTopic(selectedTopic);
    setLevel(selectedLevel);
    setView("quiz");
  };

  const handleBackToHome = () => {
    setView("home");
    setTopic(null);
    setLevel(null);
  };

  const handleNextLevel = () => {
    if (topic && level !== null) {
      const lastCompleted = progress[topic] || 0;
      const newCompleted = Math.max(lastCompleted, level); // mark level as completed
      setProgress({ ...progress, [topic]: newCompleted });

      if (level < 5) setLevel(level + 1); // next level if exists
      else setView("home"); // finished all levels
    }
  };

  const handleRetry = () => setView("quiz"); // retry same level

  // Landing page floating icons
  const icons = [
    { icon: <Airdrop variant="Bold" size="32" color="#1F7A2E" />, x: 50, y: 50, rotate: true },
    { icon: <Aquarius variant="Bold" size="32" color="#0DAB76" />, x: 200, y: 80 },
    { icon: <Bezier variant="Bold" size="32" color="#FF9F1C" />, x: 350, y: 60, rotate: true },
    { icon: <Tree variant="Bold" size="32" color="#0DAB76" />, x: 500, y: 100 },
    { icon: <Drop variant="Bold" size="32" color="#0096FF" />, x: 150, y: 200, rotate: true },
    { icon: <OceanProtocol variant="Bold" size="32" color="#FFD700" />, x: 400, y: 250 },
    { icon: <Star1 variant="Bold" size="32" color="#FFB800" />, x: 600, y: 150, rotate: true },
    { icon: <Flash variant="Bold" size="32" color="#FF4500" />, x: 300, y: 300 },
    { icon: <Drop variant="Bold" size="32" color="#0096FF" />, x: 550, y: 350, rotate: true },
    { icon: <Avalanche variant="Bold" size="32" color="#1F7A2E" />, x: 700, y: 200 },
    { icon: <Award variant="Bold" size="32" color="#FF8A65" />, x: 250, y: 400, rotate: true },
    { icon: <AirplaneSquare variant="Bold" size="32" color="#FF6F61" />, x: 500, y: 50 },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-green-100 via-green-50 to-white relative flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-green-200 shadow-lg z-20">
        <h1 className="text-3xl font-extrabold text-green-900 flex items-center gap-2 animate-pulse">
          <Airdrop variant="Bold" size="28" color="#0DAB76" /> Green Quiz Game
        </h1>
        {view !== "landing" && (
          <button
            onClick={() => setView("landing")}
            className="px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition"
          >
            ← Back
          </button>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 flex justify-center items-center p-6 relative overflow-hidden">
        {view === "landing" && (
          <>
            {/* Floating animated icons */}
            {icons.map((i, idx) => (
              <motion.div
                key={idx}
                className="absolute cursor-pointer z-10"
                initial={{ x: i.x, y: i.y, scale: 0 }}
                animate={{
                  x: [i.x, i.x + 10, i.x - 10, i.x],
                  y: [i.y, i.y + 10, i.y - 10, i.y],
                  rotate: i.rotate ? [0, 15, -15, 0] : 0,
                  scale: [0.8, 1.1, 0.9, 1],
                }}
                transition={{ repeat: Infinity, duration: 4 + idx * 0.2, ease: "easeInOut" }}
                whileHover={{ scale: 1.3, rotate: i.rotate ? 30 : 0, y: i.y - 5 }}
              >
                {i.icon}
              </motion.div>
            ))}

            {/* Lottie Hero Animation */}
            <div className="w-64 h-64 mb-6 z-20">
              <Lottie animationData={ecologyAnim} loop />
            </div>

            {/* Welcome Text */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl font-extrabold text-green-900 mb-4 z-20 text-center"
            >
              Welcome to <span className="text-green-700">Aquarius Rush!</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-green-700 text-lg max-w-md mb-12 z-20 text-center"
            >
              Learn about the environment through fun, interactive quizzes and mini-games! 🌿
            </motion.p>

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.2, rotate: [0, 5, -5, 0] }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView("home")}
              className="px-10 py-4 bg-green-700 text-white text-2xl rounded-full shadow-xl hover:bg-green-800 z-20 flex items-center gap-4"
            >
              <Airdrop variant="Bold" size="28" color="#fff" /> Start Playing
            </motion.button>
          </>
        )}

        {view === "home" && <Home onStartQuiz={handleStartQuiz} progress={progress} />}

        {view === "quiz" && topic && level !== null && (
          <QuizPlayer
            topic={topic}
            level={level}
            onBack={handleBackToHome}
            onNextLevel={handleNextLevel}
            onRetry={handleRetry}
          />
        )}
      </main>

      {/* Footer */}
      {view !== "landing" && (
        <footer className="bg-green-100 p-3 flex justify-between items-center text-green-900 font-semibold shadow-inner z-20">
          <span>🍀 Keep learning and have fun!</span>
          <span>💎 Score Tracker</span>
        </footer>
      )}
    </div>
  );
}
