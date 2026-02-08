import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Feedback } from '../../hooks/useGameLogic';

interface FeedbackOverlayProps {
  feedback: Feedback | null;
  streak: number;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ feedback, streak }) => {
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

  // Don't show "New Round" messages here as they have their own banner
  if (feedback?.type === 'info') return null;

  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 1.5, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          key={feedback.message}
          style={{
            position: 'absolute',
            bottom: '15%', // Adjusted to be above the footer but below the board usually
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 100
          }}
        >
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            padding: '1rem 2rem',
            borderRadius: '50px',
            border: `2px solid ${feedback.type === 'error' ? '#ff0055' : '#00f3ff'}`,
            boxShadow: `0 0 30px ${feedback.type === 'error' ? 'rgba(255,0,85,0.4)' : 'rgba(0,243,255,0.4)'}`,
            textAlign: 'center'
          }}>
            <span style={{
                color: feedback.type === 'error' ? '#ff0055' : '#00f3ff',
                fontSize: '1.5rem',
                fontWeight: '900',
                textTransform: 'uppercase',
                textShadow: '0 0 10px currentColor',
                whiteSpace: 'nowrap'
            }}>
                {feedback.message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
