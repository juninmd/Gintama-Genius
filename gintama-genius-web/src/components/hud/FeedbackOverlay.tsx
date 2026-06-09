import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Feedback } from '../../hooks/useGameLogic';
import { useConfettiEffect } from './hooks/useConfettiEffect';

interface FeedbackOverlayProps {
  feedback: Feedback | null;
  streak: number;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ feedback, streak }) => {
  const isCombo = feedback?.message.includes('SEQUÊNCIA') || feedback?.message.includes('COMBO') || false;
  const isError = feedback?.type === 'error';
  const isSuccess = feedback?.type === 'success';

  useConfettiEffect(feedback, isCombo);

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
          animate={{
            opacity: 1,
            scale: isSuccess && !isCombo ? [1, 1.3, 1.1] : 1.2,
            rotate: isCombo ? [0, -5, 5, 0] : isError ? [-10, 10, -10, 10, 0] : 0,
            y: 0,
            x: isError ? [-15, 15, -15, 15, 0] : 0
          }}
          exit={{ opacity: 0, scale: 1.5, rotate: isError ? 10 : -10, y: -50 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
            rotate: { duration: 0.3 },
            x: { duration: 0.3 }
          }}
          className={`feedback-overlay-container ${isCombo ? 'combo' : ''} ${isError ? 'error' : ''} ${isSuccess ? 'success' : ''}`}
        >
          <div className={`feedback-overlay-box ${isCombo ? 'combo' : ''}`}
               style={{
                 border: `4px solid ${getBorderColor()}`,
                 boxShadow: `0 0 60px ${getShadowColor()}`,
               }}>
            <span className={`feedback-text ${isCombo ? 'combo' : ''}`}
                  style={{
                    color: isCombo ? '#000' : getBorderColor(),
                    textShadow: isCombo ? 'none' : `0 0 20px ${getBorderColor()}`,
                  }}>
                {feedback.message}
            </span>

            {isCombo && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="feedback-streak-badge"
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
