import React from 'react';
import { motion } from 'framer-motion';
import { Play, Swords, Skull, Zap, Timer, Infinity as InfinityIcon } from 'lucide-react';
import type { Difficulty, TimeMode } from '../hooks/useGameLogic';

interface MenuProps {
  onStart: (difficulty: Difficulty, timeMode: TimeMode) => void;
}

const Menu: React.FC<MenuProps> = ({ onStart }) => {
  const [difficulty, setDifficulty] = React.useState<Difficulty>('NORMAL');
  const [timeMode, setTimeMode] = React.useState<TimeMode>('60s');

  const getDifficultyIcon = (diff: Difficulty) => {
    switch (diff) {
      case 'EASY': return <Zap className="w-5 h-5 text-green-400" />;
      case 'NORMAL': return <Swords className="w-5 h-5 text-blue-400" />;
      case 'BERSERK': return <Skull className="w-5 h-5 text-red-500" />;
    }
  };

  const getTimeIcon = (time: TimeMode) => {
    if (time === 'INFINITE') return <InfinityIcon className="w-5 h-5 text-purple-400" />;
    return <Timer className="w-5 h-5 text-yellow-400" />;
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="menu-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.img
        src="/assets/images/splash.png"
        alt="Gintama Genius"
        className="splash-image"
        variants={itemVariants}
      />

      <div className="menu-controls">
        <motion.div className="setting-wrapper" variants={itemVariants}>
          <div className="setting-label">
            {getDifficultyIcon(difficulty)}
            <span>Difficulty</span>
          </div>
          <div className="select-container">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className={`difficulty-select ${difficulty.toLowerCase()}`}
            >
              <option value="EASY">Easy</option>
              <option value="NORMAL">Normal</option>
              <option value="BERSERK">Berserk</option>
            </select>
            <div className="select-arrow">▼</div>
          </div>
        </motion.div>

        <motion.div className="setting-wrapper" variants={itemVariants}>
          <div className="setting-label">
            {getTimeIcon(timeMode)}
            <span>Time Limit</span>
          </div>
          <div className="select-container">
            <select
              value={timeMode}
              onChange={(e) => setTimeMode(e.target.value as TimeMode)}
            >
              <option value="30s">30 Seconds</option>
              <option value="60s">60 Seconds</option>
              <option value="120s">120 Seconds</option>
              <option value="240s">240 Seconds</option>
              <option value="INFINITE">Infinite</option>
            </select>
            <div className="select-arrow">▼</div>
          </div>
        </motion.div>

        <motion.button
          className="start-button-modern"
          onClick={() => onStart(difficulty, timeMode)}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play fill="currentColor" className="w-6 h-6" />
          <span>START GAME</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Menu;
