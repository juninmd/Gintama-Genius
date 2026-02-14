import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Timer, Settings, Volume2, VolumeX } from 'lucide-react';
import { DIFFICULTY_MAP } from '../../constants';

interface HUDHeaderProps {
  score: number;
  level: number;
  timeLeft: number;
  difficulty: string;
  isMuted: boolean;
  toggleMute: () => void;
}

export const HUDHeader: React.FC<HUDHeaderProps> = ({ score, level, timeLeft, difficulty, isMuted, toggleMute }) => {
  return (
    <div className="hud-header">
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={toggleMute}
          className="hud-item"
          style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
          title={isMuted ? 'Ativar Som' : 'Silenciar'}
        >
          {isMuted ? <VolumeX size={20} color="#ff0055" /> : <Volume2 size={20} color="#00f3ff" />}
        </button>

        <div className="hud-item" title="Pontuação">
          <Trophy size={20} color="#f9f871" />
          <motion.span
            key={score}
            initial={{ scale: 1, textShadow: "0 0 0px #fff" }}
            animate={{ scale: [1, 1.2, 1], textShadow: ["0 0 0px #fff", "0 0 10px #fff", "0 0 0px #fff"] }}
            className="hud-value"
          >
            {score}
          </motion.span>
        </div>
        <div className="hud-item" title="Nível">
          <Zap size={20} color="#00f3ff" />
          <span className="hud-value">LVL {level}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <motion.div
          className="hud-item"
          animate={timeLeft <= 10 ? { boxShadow: ["0 0 0px #f00", "0 0 20px #f00"] } : {}}
          transition={{ repeat: Infinity, duration: 0.5, repeatType: "reverse" }}
        >
          <Timer size={20} color={timeLeft <= 10 ? "#ff0055" : "#fff"} />
          <span className="hud-value">{timeLeft === Infinity ? '∞' : `${timeLeft}s`}</span>
        </motion.div>
        <div className="hud-item" title="Dificuldade">
          <Settings size={20} color="#fff" />
          <span className="hud-value-small">{DIFFICULTY_MAP[difficulty] || difficulty}</span>
        </div>
      </div>
    </div>
  );
};
