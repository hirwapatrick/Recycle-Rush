import { useState } from "react";
import { FaLeaf } from "react-icons/fa";
import Home from "./components/Home";
import QuizPlayer from "./components/QuizPlayer";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import ecologyAnim from "./anime/Ecology.json";

type View = "landing" | "home" | "quiz";

export default function App(): JSX.Element {
  const [view, setView] = useState<View>("landing");
  const [topic, setTopic] = useState<string | null>(null);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-green-100 via-green-50 to-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-green-200 shadow-lg">
        <h1 className="text-3xl font-extrabold text-green-900 flex items-center gap-2 animate-pulse">
          <FaLeaf className="text-green-700" /> Green Quiz Game
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

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-center p-6">
        {/* 🌍 Landing Page */}
        {view === "landing" && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-64 h-64 mb-6">
              <Lottie animationData={ecologyAnim} loop={true} />
            </div>

            <h1 className="text-4xl font-extrabold text-green-900 mb-4">
              Welcome to <span className="text-green-700">Recycle Rush!</span>
            </h1>

            <p className="text-green-700 text-lg max-w-md mb-8">
              Learn about the environment through fun, interactive quizzes! 🌿
            </p>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView("home")}
              className="px-8 py-3 bg-green-700 text-white text-xl rounded-full shadow-lg hover:bg-green-800 transition-all"
            >
              ▶ Start Playing
            </motion.button>
          </motion.div>
        )}

        {/* 🧩 Home Page */}
        {view === "home" && (
          <Home
            onSelectTopic={(t: string) => {
              setTopic(t);
              setView("quiz");
            }}
          />
        )}

        {/* 🏆 Quiz Player */}
        {view === "quiz" && topic && (
          <QuizPlayer topic={topic} onBack={() => setView("home")} />
        )}
      </main>

      {/* Footer */}
      {view !== "landing" && (
        <footer className="bg-green-100 p-3 flex justify-between items-center text-green-900 font-semibold shadow-inner">
          <span>🍀 Keep learning and have fun!</span>
          <span>💎 Score Tracker</span>
        </footer>
      )}
    </div>
  );
}
