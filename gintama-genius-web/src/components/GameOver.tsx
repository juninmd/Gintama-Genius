import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Trophy } from 'lucide-react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  return (
    <div className="game-over-overlay">
       {/* Background image if needed, or we rely on the overlay color */}
       {/* If gameover.png is a specific graphic, we might want to display it differently.
           For now, let's keep the overlay clean and just show the content.
           If the user really wanted the bg image, we can add it back, but usually text on image is hard to read.
       */}

      <motion.div
        className="game-over-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <h2>Game Over</h2>
        </motion.div>

        <motion.div
            className="score-display"
            style={{ fontSize: '1.5rem', margin: '1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
        >
            <Trophy size={32} color="#FFD700" />
            <span>Score: {score}</span>
        </motion.div>

        <motion.button
          onClick={onRestart}
          className="restart-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '2rem auto 0' }}
        >
          <RefreshCw size={20} />
          Play Again
        </motion.button>
      </motion.div>
    </div>
  );
};

export default GameOver;
