import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MESSAGES_NEW_ROUND } from '../../constants';
import type { Feedback } from '../../hooks/useGameLogic';

interface NewRoundBannerProps {
  feedback: Feedback | null;
}

export const NewRoundBanner: React.FC<NewRoundBannerProps> = ({ feedback }) => {
  const isNewRound = feedback?.type === 'info' || (feedback?.message && MESSAGES_NEW_ROUND.includes(feedback.message));

  return (
    <AnimatePresence>
      {isNewRound && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0, x: '-100%', skewX: -40, rotate: -5 }}
          animate={{ scale: 1, opacity: 1, x: 0, skewX: [20, -10, 5, 0], rotate: [-5, 5, -5, 0] }}
          exit={{ scale: 1.5, opacity: 0, x: '100%', skewX: 40, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 12, duration: 0.4 }}
          style={{
            position: 'fixed',
            top: '25%',
            left: 0,
            right: 0,
            textAlign: 'center',
            color: '#bc13fe',
            fontSize: 'clamp(2rem, 8vw, 4rem)',
            fontWeight: '900',
            textShadow: '0 0 20px #bc13fe, 0 0 40px #bc13fe',
            zIndex: 100,
            background: 'rgba(0,0,0,0.8)',
            padding: '2rem 0',
            borderTop: '4px solid #bc13fe',
            borderBottom: '4px solid #bc13fe',
            backdropFilter: 'blur(10px)'
          }}
        >
          {feedback?.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
