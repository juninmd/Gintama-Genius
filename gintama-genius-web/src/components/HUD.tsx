import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Timer, Settings, Flame } from 'lucide-react';
import type { Feedback } from '../hooks/useGameLogic';

interface HUDProps {
  score: number;
  level: number;
  timeLeft: number;
  difficulty: string;
  streak: number;
  feedback: Feedback | null;
}

const HUD: React.FC<HUDProps> = ({ score, level, timeLeft, difficulty, streak, feedback }) => {
  return (
    <>
      <div className="hud">
        <div className="hud-group">
            <div className="hud-item" title="Score">
                <Trophy size={18} className="hud-icon" color="#FFD700" />
                <span>{score}</span>
            </div>
            <div className="hud-item" title="Level">
                <Zap size={18} className="hud-icon" color="#00BFFF" />
                <span>{level}</span>
            </div>
        </div>

        <div className="hud-group">
            <div className={`hud-item ${timeLeft <= 10 ? 'urgent' : ''}`} title="Time">
                <Timer size={18} className="hud-icon" />
                <span>{timeLeft === Infinity ? '∞' : `${timeLeft}s`}</span>
            </div>
            <div className="hud-item" title="Difficulty">
                <Settings size={18} className="hud-icon" />
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>{difficulty}</span>
            </div>
        </div>
      </div>

      {/* Streak Counter - Floating below HUD */}
      <AnimatePresence>
        {streak > 1 && (
            <motion.div
                className="streak-display"
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                key="streak-display"
            >
                <Flame size={24} color="#FF4500" fill="#FF4500" />
                <span className="streak-count">{streak}</span>
                <span className="streak-label">COMBO!</span>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Central Feedback Overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            className={`feedback-message feedback-${feedback.type}`}
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            key={feedback.message} // re-animate on message change
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HUD;
