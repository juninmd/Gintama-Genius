import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Timer, Settings, Flame, Eye, MousePointerClick, AlertTriangle, Volume2, VolumeX } from 'lucide-react';
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
  isUrgent: boolean;
  isMuted: boolean;
  toggleMute: () => void;
}

const difficultyMap: Record<string, string> = {
  EASY: 'SHINPACHI',
  NORMAL: 'YOROZUYA',
  BERSERK: 'SHURA',
};

// 1. Top Bar (Score, Level, Time, Difficulty)
export const HUDHeader: React.FC<Pick<HUDProps, 'score' | 'level' | 'timeLeft' | 'difficulty' | 'isMuted' | 'toggleMute'>> = ({ score, level, timeLeft, difficulty, isMuted, toggleMute }) => {
  return (
      <div className="hud-header">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
                onClick={toggleMute}
                className="hud-item"
                style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                title={isMuted ? "Ativar Som" : "Mudo"}
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
                <span className="hud-value-small">{difficultyMap[difficulty] || difficulty}</span>
            </div>
        </div>
      </div>
  );
};

// 2. Turn Indicator
export const TurnIndicator: React.FC<{ gameState: GameState }> = ({ gameState }) => {
    return (
        <div className="turn-indicator-wrapper" style={{ height: '40px', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
             <AnimatePresence mode="wait">
                {gameState === 'PLAYING_SEQUENCE' ? (
                    <motion.div
                        key="watch"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={{ color: '#f9f871', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '1.2rem', fontWeight: 'bold', textShadow: '0 0 10px #f9f871' }}
                    >
                        <Eye size={24} />
                        <span>OBSERVE</span>
                    </motion.div>
                ) : gameState === 'WAITING_FOR_INPUT' ? (
                     <motion.div
                        key="play"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={{ color: '#00f3ff', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '1.2rem', fontWeight: 'bold', textShadow: '0 0 10px #00f3ff' }}
                    >
                        <MousePointerClick size={24} />
                        <span>SUA VEZ</span>
                    </motion.div>
                ) : null}
             </AnimatePresence>
        </div>
    );
};

// 3. Streak Badge
export const StreakBadge: React.FC<{ streak: number }> = ({ streak }) => {
    return (
        <AnimatePresence>
        {streak > 1 && (
            <motion.div
                className="streak-display"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                key="streak-display"
            >
                <Flame size={24} color="#ff0055" />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                    <span className="streak-count">{streak}</span>
                    <span className="streak-label">COMBO</span>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    );
};

// 4. Urgent Indicator
export const UrgentIndicator: React.FC<{ visible: boolean }> = ({ visible }) => {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="urgent-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        color: '#ff0055',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        textShadow: '0 0 10px #ff0055',
                        padding: '0.5rem 1rem',
                        background: 'rgba(0,0,0,0.5)',
                        borderRadius: '8px',
                        border: '1px solid #ff0055'
                    }}
                >
                    <AlertTriangle size={24} />
                    <span>TEMPO CRÍTICO</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// 5. New Round Banner
export const NewRoundBanner: React.FC<{ feedback: Feedback | null }> = ({ feedback }) => {
    const isNewRound = feedback?.message === "NOVA RODADA!" || feedback?.message === "PRÓXIMO NÍVEL!" || feedback?.message === "PREPARE-SE!";

    return (
        <AnimatePresence>
            {isNewRound && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'absolute',
                        top: '40%',
                        width: '100%',
                        textAlign: 'center',
                        color: '#00f3ff',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        textShadow: '0 0 20px #00f3ff',
                        zIndex: 100,
                        background: 'rgba(0,0,0,0.7)',
                        padding: '1rem 0',
                        borderTop: '1px solid #00f3ff',
                        borderBottom: '1px solid #00f3ff'
                    }}
                >
                   {feedback?.message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}


// 6. Feedback Overlay
export const FeedbackOverlay: React.FC<{ feedback: Feedback | null, streak: number }> = ({ feedback, streak }) => {
    useEffect(() => {
        if (feedback?.type === 'info') {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.4 },
            colors: ['#00f3ff', '#ff0055', '#f9f871'],
            disableForReducedMotion: true
          });
        }
        if (feedback?.type === 'success' && streak % 5 === 0 && streak > 0) {
            confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.7 },
                scalar: 0.8,
                shapes: ['square'],
                colors: ['#00f3ff', '#ff0055'],
                disableForReducedMotion: true
            });
        }
      }, [feedback, streak]);

      if (feedback?.message === "NOVA RODADA!" || feedback?.message === "PRÓXIMO NÍVEL!" || feedback?.message === "PREPARE-SE!") return null;

      return (
        <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            key={feedback.message}
            style={{
                position: 'absolute',
                bottom: '20%',
                left: '50%',
                transform: 'translate(-50%, 0)', // Centering is handled by left 50% + x -50 in CSS usually, but here just inline
                marginLeft: '-150px', // Hacky centering or use transform
                width: '300px',
                textAlign: 'center',
                color: feedback.type === 'error' ? '#ff0055' : '#00f3ff',
                fontSize: '2rem',
                fontWeight: 'bold',
                textShadow: '0 0 10px currentColor',
                zIndex: 50,
                pointerEvents: 'none'
            }}
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>
      );
};
