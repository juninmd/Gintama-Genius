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

const difficultyMap: Record<string, string> = {
  EASY: 'SHINPACHI',
  NORMAL: 'SAMURAI',
  BERSERK: 'YATO',
};

// 1. Top Bar (Score, Level, Time, Difficulty)
export const HUDHeader: React.FC<Pick<HUDProps, 'score' | 'level' | 'timeLeft' | 'difficulty'>> = ({ score, level, timeLeft, difficulty }) => {
  return (
      <div className="hud-header">
        <div className="hud-group left">
            <div className="hud-item" title="Pontuação">
                <Trophy size={20} className="hud-icon" color="#FFD700" />
                <motion.span
                    key={score}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ type: "spring", duration: 0.3 }}
                    className="hud-value"
                >
                    {score}
                </motion.span>
            </div>
            <div className="hud-item" title="Nível">
                <Zap size={20} className="hud-icon" color="#00BFFF" />
                <motion.span
                    key={level}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.5, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ type: "spring", duration: 0.4 }}
                    className="hud-value"
                >
                    {level}
                </motion.span>
            </div>
        </div>

        <div className="hud-group right">
            <motion.div
                className={`hud-item ${timeLeft <= 10 ? 'urgent' : ''}`}
                title="Tempo"
                animate={timeLeft <= 10 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.5 }}
            >
                <Timer size={20} className="hud-icon" />
                <span className="hud-value">{timeLeft === Infinity ? '∞' : `${timeLeft}s`}</span>
            </motion.div>
            <div className="hud-item hud-item-difficulty" title="Dificuldade">
                <Settings size={20} className="hud-icon" />
                <span className="hud-value-small">{difficultyMap[difficulty] || difficulty}</span>
            </div>
        </div>
      </div>
  );
};

// 2. Turn Indicator (Observe / Play)
export const TurnIndicator: React.FC<{ gameState: GameState }> = ({ gameState }) => {
    return (
        <div className="turn-indicator-wrapper">
             <AnimatePresence mode="wait">
                {gameState === 'PLAYING_SEQUENCE' ? (
                    <motion.div
                        key="watch"
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        className="turn-badge watch"
                    >
                        <Eye size={20} />
                        <span>OBSERVE</span>
                    </motion.div>
                ) : gameState === 'WAITING_FOR_INPUT' ? (
                     <motion.div
                        key="play"
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        className="turn-badge play"
                    >
                        <MousePointerClick size={20} />
                        <span>SUA VEZ</span>
                    </motion.div>
                ) : <div className="turn-placeholder" />}
             </AnimatePresence>
        </div>
    );
};

// 3. Streak Badge
export const StreakBadge: React.FC<{ streak: number }> = ({ streak }) => {
    const getStreakColor = (s: number) => {
        if (s < 5) return "#FF4500"; // Orange
        if (s < 10) return "#DC143C"; // Red
        if (s < 15) return "#00BFFF"; // Blue
        return "#9400D3"; // Purple
    };

    const color = getStreakColor(streak);

    return (
        <AnimatePresence>
        {streak > 1 && (
            <motion.div
                className="streak-display"
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                key="streak-display"
            >
                <div className="streak-icon-wrapper">
                    <Flame size={28} color={color} fill={color} />
                </div>
                <div className="streak-text">
                    <span className="streak-count" style={{ color: color }}>{streak}</span>
                    <span className="streak-label">COMBO</span>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    );
};

// 4. Feedback Overlay (Confetti logic + Text)
export const FeedbackOverlay: React.FC<{ feedback: Feedback | null, streak: number }> = ({ feedback, streak }) => {
    useEffect(() => {
        if (feedback?.type === 'info') { // New Round
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.4 },
            colors: ['#FFD700', '#FF4500', '#00BFFF', '#32CD32'],
            disableForReducedMotion: true
          });
        }
        // Celebrate every 5 streak
        if (feedback?.type === 'success' && streak % 5 === 0 && streak > 0) {
            confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.7 },
                scalar: 0.8,
                shapes: ['star'],
                colors: ['#FFD700', '#FFA500'],
                disableForReducedMotion: true
            });
        }
        if (feedback?.message === "Corra!") {
            // Subtle pulse confetti
        }
      }, [feedback, streak]);

      return (
        <AnimatePresence>
        {feedback && (
          <motion.div
            className={`feedback-message feedback-${feedback.type}`}
            initial={{ opacity: 0, scale: 0.5, y: 50, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(8px)', y: 50, x: '-50%' }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            key={feedback.message}
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>
      );
};

// Default export if needed for backward compatibility, but we prefer the sub-components now.
const HUD: React.FC<HUDProps> = (props) => {
    return (
        <>
            <HUDHeader {...props} />
            <TurnIndicator gameState={props.gameState} />
            <StreakBadge streak={props.streak} />
            <FeedbackOverlay feedback={props.feedback} streak={props.streak} />
        </>
    );
};

export default HUD;
