import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Timer, Settings, Flame, Eye, MousePointerClick } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Feedback, GameState } from '../hooks/useGameLogic';

interface HUDProps {
  gameState: GameState;
  score: number;
  level: number;
  timeLeft: number;
  difficulty: string;
  streak: number;
  feedback: Feedback | null;
}

const HUD: React.FC<HUDProps> = ({ gameState, score, level, timeLeft, difficulty, streak, feedback }) => {

  useEffect(() => {
    if (feedback?.type === 'info') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF4500', '#00BFFF', '#32CD32']
      });
    }
    // Celebrate every 5 streak
    if (feedback?.type === 'success' && streak % 5 === 0 && streak > 0) {
        confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.8 },
            scalar: 0.7,
            shapes: ['star']
        });
    }
  }, [feedback, streak]);

  return (
    <>
      <div className="hud">
        <div className="hud-group">
            <div className="hud-item" title="Pontuação">
                <Trophy size={20} className="hud-icon" color="#FFD700" />
                <span className="hud-value">{score}</span>
            </div>
            <div className="hud-item" title="Nível">
                <Zap size={20} className="hud-icon" color="#00BFFF" />
                <span className="hud-value">{level}</span>
            </div>
        </div>

        {/* Turn Indicator - Centered in HUD on Desktop, or below on mobile via CSS */}
        <div className="turn-indicator-wrapper">
             <AnimatePresence mode="wait">
                {gameState === 'PLAYING_SEQUENCE' ? (
                    <motion.div
                        key="watch"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="turn-badge watch"
                    >
                        <Eye size={18} />
                        <span>OBSERVE</span>
                    </motion.div>
                ) : gameState === 'WAITING_FOR_INPUT' ? (
                     <motion.div
                        key="play"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="turn-badge play"
                    >
                        <MousePointerClick size={18} />
                        <span>SUA VEZ</span>
                    </motion.div>
                ) : null}
             </AnimatePresence>
        </div>

        <div className="hud-group">
            <div className={`hud-item ${timeLeft <= 10 ? 'urgent' : ''}`} title="Tempo">
                <Timer size={20} className="hud-icon" />
                <span className="hud-value">{timeLeft === Infinity ? '∞' : `${timeLeft}s`}</span>
            </div>
            <div className="hud-item" title="Dificuldade">
                <Settings size={20} className="hud-icon" />
                <span className="hud-value-small">{difficulty}</span>
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
                <div className="streak-icon-wrapper">
                    <Flame size={32} color="#FF4500" fill="#FF4500" />
                </div>
                <div className="streak-text">
                    <span className="streak-count">{streak}</span>
                    <span className="streak-label">COMBO!</span>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Central Feedback Overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            className={`feedback-message feedback-${feedback.type}`}
            initial={{ opacity: 0, scale: 0.5, rotate: -10, y: '-50%', x: '-50%' }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)', y: '-50%', x: '-50%' }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
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
