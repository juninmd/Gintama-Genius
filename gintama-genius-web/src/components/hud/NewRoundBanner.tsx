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
          initial={{ scale: 0.8, opacity: 0, x: '-100%' }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ scale: 1.2, opacity: 0, x: '100%' }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{
            position: 'absolute',
            top: '40%',
            left: 0,
            right: 0,
            textAlign: 'center',
            color: '#00f3ff',
            fontSize: 'min(3rem, 10vw)',
            fontWeight: 'bold',
            textShadow: '0 0 20px #00f3ff',
            zIndex: 100,
            background: 'rgba(0,0,0,0.8)',
            padding: '2rem 0',
            borderTop: '2px solid #00f3ff',
            borderBottom: '2px solid #00f3ff',
            backdropFilter: 'blur(8px)'
          }}
        >
          {feedback?.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
