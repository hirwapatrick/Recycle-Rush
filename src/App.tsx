import { useState, useEffect, useRef } from "react";
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
  VolumeCross,
  VolumeHigh,
} from "iconsax-reactjs";

import bgVideo from "/bg.mp4"; 
import bgMusic from "/bg-music.mp3";

type View = "landing" | "home" | "quiz";
type Progress = Record<string, number>;

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [topic, setTopic] = useState<string | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [progress, setProgress] = useState<Progress>({});
  const [isMuted, setIsMuted] = useState<boolean>(true); // 🎵 Mute toggle

  const audioRef = useRef<HTMLAudioElement>(null);

  // ✅ Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem("green_quiz_progress");
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch {
        console.warn("Failed to parse saved progress");
      }
    }
  }, []);

  // ✅ Save progress
  useEffect(() => {
    localStorage.setItem("green_quiz_progress", JSON.stringify(progress));
  }, [progress]);

  // ✅ Background Music Control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.pause();
    } else {
      audio.play().catch(() => console.log("Autoplay blocked, user interaction needed"));
    }
  }, [isMuted, view]);

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
      const newCompleted = Math.max(lastCompleted, level);
      setProgress((prev) => ({ ...prev, [topic]: newCompleted }));

      if (level < 5) {
        setLevel(level + 1);
      } else {
        setView("home");
      }
    }
  };

  const handleRetry = () => setView("quiz");

  // ✅ Animated floating icons
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
    <div className="h-screen w-screen overflow-hidden relative flex flex-col">
      {/* 🎥 Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        src={bgVideo}
        autoPlay
        loop
        muted={isMuted} // sync mute state with sound
      />

      {/* 🎵 Background Music */}
      <audio ref={audioRef} src={bgMusic} loop preload="auto" />

      {/* ✅ Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-green-200 bg-opacity-70 backdrop-blur-md shadow-lg z-20">
        <h1 className="text-3xl font-extrabold text-green-900 flex items-center gap-2 animate-pulse">
          <Airdrop variant="Bold" size="28" color="#0DAB76" /> Green Quiz Game
        </h1>

        <div className="flex items-center gap-4">
          {/* 🎵 Music Toggle */}
          <button
            onClick={() => setIsMuted((prev) => !prev)}
            className="p-2 rounded-full bg-green-700 text-white shadow hover:bg-green-800 transition"
          >
            {isMuted ? (
              <VolumeCross size="24" color="#fff" variant="Bold" />
            ) : (
              <VolumeHigh size="24" color="#fff" variant="Bold" />
            )}
          </button>

          {view !== "landing" && (
            <button
              onClick={() => setView("landing")}
              className="px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition"
            >
              ← Back
            </button>
          )}
        </div>
      </header>

      {/* ✅ Main Section */}
      <main className="flex-1 flex justify-center items-center p-6 relative overflow-hidden">
        {/* Landing Page */}
        {view === "landing" && (
          <>
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

            <div className="w-64 h-64 mb-6 z-20">
              <Lottie animationData={ecologyAnim} loop />
            </div>

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

        {/* Home Page */}
        {view === "home" && <Home onStartQuiz={handleStartQuiz} progress={progress} />}

        {/* Quiz Page */}
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
    </div>
  );
}
