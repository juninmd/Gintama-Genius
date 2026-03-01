import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Feedback } from '../../hooks/useGameLogic';

interface FeedbackOverlayProps {
  feedback: Feedback | null;
  streak: number;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ feedback, streak }) => {
  const isCombo = feedback?.message.includes('SEQUÊNCIA') || feedback?.message.includes('COMBO');
  const isError = feedback?.type === 'error';
  const isSuccess = feedback?.type === 'success';

  // Confetti Effects
  useEffect(() => {
    if (!feedback) return;

    if (feedback.type === 'info') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.4 },
        colors: ['#00f3ff', '#ff0055', '#f9f871'],
        disableForReducedMotion: true
      });
    }

    if (isCombo) {
      // Big burst for combo
      const duration = 1500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff0055', '#f9f871']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00f3ff', '#bc13fe']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [feedback, isCombo]);

  if (feedback?.type === 'info') return null;

  const getBorderColor = () => {
    if (isError) return '#ff0055';
    if (isCombo) return '#f9f871';
    if (isSuccess) return '#00ff00';
    return '#00f3ff';
  };

  const getShadowColor = () => {
    if (isError) return 'rgba(255,0,85,0.8)';
    if (isCombo) return 'rgba(249,248,113,0.8)';
    if (isSuccess) return 'rgba(0,255,0,0.8)';
    return 'rgba(0,243,255,0.8)';
  };

  return (
    <AnimatePresence mode='wait'>
      {feedback && (
        <motion.div
          key={feedback.message + streak}
          initial={{ opacity: 0, scale: 0.5, rotate: isError ? -10 : 10, y: 50 }}
          animate={{ opacity: 1, scale: 1, rotate: isCombo ? [0, -5, 5, 0] : 0, y: 0 }}
          exit={{ opacity: 0, scale: 1.5, rotate: isError ? 10 : -10, y: -50 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
            rotate: { duration: 0.5 }
          }}
          style={{
            position: 'absolute',
            top: '40%',
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 150
          }}
        >
          <div style={{
            background: isCombo
                ? 'linear-gradient(135deg, rgba(255,0,85,0.95), rgba(249,248,113,0.95))'
                : 'rgba(0,0,0,0.85)',
            padding: isCombo ? '1.5rem 3rem' : '1rem 2rem',
            borderRadius: '50px',
            border: `3px solid ${getBorderColor()}`,
            boxShadow: `0 0 50px ${getShadowColor()}`,
            textAlign: 'center',
            transform: isCombo ? 'scale(1.1)' : 'none',
            backdropFilter: 'blur(8px)'
          }}>
            <span style={{
                color: isCombo ? '#000' : getBorderColor(),
                fontSize: isCombo ? '1.8rem' : '1.5rem',
                fontWeight: '900',
                textTransform: 'uppercase',
                textShadow: isCombo ? 'none' : `0 0 10px ${getBorderColor()}`,
                whiteSpace: 'nowrap',
                fontFamily: "'Space Grotesk', sans-serif",
                display: 'block'
            }}>
                {feedback.message}
            </span>

            {isCombo && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    style={{
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        marginTop: '0.5rem',
                        color: '#000',
                        background: '#fff',
                        padding: '0.2rem 0.8rem',
                        borderRadius: '20px',
                        display: 'inline-block'
                    }}
                >
                    {streak} ACERTOS!
                </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
