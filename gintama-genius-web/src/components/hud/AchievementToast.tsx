import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Achievement } from '../../hooks/useAchievements';

interface AchievementToastProps {
  achievement: Achievement | null;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement }) => {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="achievement-toast"
        initial={{ y: -100, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -100, opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        role="alert"
      >
        <div className="achievement-icon">{achievement.icon}</div>
        <div className="achievement-info">
          <div className="achievement-label">Conquista Desbloqueada!</div>
          <div className="achievement-title">{achievement.title}</div>
          <div className="achievement-desc">{achievement.description}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
