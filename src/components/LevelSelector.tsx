//LevelSelector.tsx 
import { motion } from "framer-motion";
import { FaLock, FaCheckCircle } from "react-icons/fa";

type LevelSelectorProps = {
  topic: string;
  onSelectLevel: (topic: string, level: number) => void;
  lastCompletedLevel?: number; // highest level the player completed
};

const MAX_LEVELS = 5; // only 5 levels

export default function LevelSelector({
  topic,
  onSelectLevel,
  lastCompletedLevel = 0,
}: LevelSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="text-2xl font-bold text-green-800 mb-4">
        Select Level for <span className="text-green-600">{topic.replace("_", " ")}</span>
      </h2>

      <div className="flex flex-wrap justify-center gap-6 max-w-3xl">
        {Array.from({ length: MAX_LEVELS }, (_, i) => i + 1).map((level) => {
          // unlocked if previous level is completed
          const unlocked = level === 1 || level <= lastCompletedLevel + 1;

          return (
            <motion.button
              key={level}
              onClick={() => unlocked && onSelectLevel(topic, level)}
              whileHover={{ scale: unlocked ? 1.1 : 1, y: unlocked ? -5 : 0 }}
              whileTap={{ scale: unlocked ? 0.95 : 1 }}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center text-lg font-bold text-white 
                ${unlocked ? "bg-green-500 hover:bg-green-600 shadow-lg" : "bg-gray-400 cursor-not-allowed"}
                transition-all duration-300`}
            >
              {unlocked ? (
                <>
                  {level}
                  {level <= lastCompletedLevel && (
                    <FaCheckCircle className="absolute -top-2 -right-2 text-yellow-400" />
                  )}
                </>
              ) : (
                <FaLock className="text-gray-200 text-2xl" />
              )}

              {/* Glow effect for unlocked */}
              {unlocked && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-green-300"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
