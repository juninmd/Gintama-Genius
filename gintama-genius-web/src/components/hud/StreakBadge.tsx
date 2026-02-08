import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak }) => {
  return (
    <AnimatePresence>
      {streak > 1 && (
        <motion.div
          className="streak-display"
          initial={{ opacity: 0, scale: 0.5, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, x: -20 }}
          key="streak-display"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            <Flame size={24} color="#ff0055" fill="#ff0055" />
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <motion.span
                key={streak}
                initial={{ scale: 1.5, color: '#fff' }}
                animate={{ scale: 1, color: '#ff0055' }}
                className="streak-count"
            >
                {streak}
            </motion.span>
            <span className="streak-label">COMBO!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
