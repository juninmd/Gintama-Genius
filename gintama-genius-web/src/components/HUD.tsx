import React from 'react';
import { Trophy, TrendingUp, Timer, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface HUDProps {
  score: number;
  level: number;
  timeLeft: number;
  difficulty: string;
}

const HUD: React.FC<HUDProps> = ({ score, level, timeLeft, difficulty }) => {
  return (
    <motion.div
      className="hud"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="hud-item">
        <Trophy size={20} className="hud-icon text-yellow-400" />
        <span className="hud-value">{score}</span>
      </div>
      <div className="hud-item">
        <TrendingUp size={20} className="hud-icon text-green-400" />
        <span className="hud-value">{level}</span>
      </div>
      <div className="hud-item">
        <Timer size={20} className="hud-icon text-blue-400" />
        <span className="hud-value">{timeLeft === Infinity ? '∞' : `${timeLeft}s`}</span>
      </div>
      <div className="hud-item">
        <Settings size={20} className="hud-icon text-purple-400" />
        <span className="hud-value">{difficulty}</span>
      </div>
    </motion.div>
  );
};

export default HUD;
