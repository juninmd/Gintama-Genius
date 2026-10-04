import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak }) => {
  const getStreakConfig = (count: number) => {
    if (count >= 15) return { color: '#bc13fe', shadow: '#bc13fe', label: 'BERSERK!', scale: [1, 1.8, 1], shadowDuration: 0.5, flameDuration: 0.3 };
    if (count >= 10) return { color: '#ff0055', shadow: '#ff0055', label: 'SUPER!', scale: [1, 1.6, 1], shadowDuration: 0.8, flameDuration: 0.5 };
    if (count >= 5) return { color: '#f9f871', shadow: '#f9f871', label: 'COMBO!', scale: [1, 1.4, 1], shadowDuration: 1.0, flameDuration: 0.6 };
    return { color: '#00f3ff', shadow: '#00f3ff', label: 'SEQUÊNCIA', scale: [1, 1.2, 1], shadowDuration: 1.5, flameDuration: 0.8 };
  };

  const config = useMemo(() => getStreakConfig(streak), [streak]);

  return (
    <AnimatePresence>
      {streak > 1 && (
        <motion.div
          className="streak-display pulse-neon-active"
          initial={{ opacity: 0, scale: 0.5, x: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
            borderColor: config.color,
            boxShadow: [
              `0 0 15px ${config.shadow}4d`,
              `0 0 30px ${config.shadow}80`,
              `0 0 15px ${config.shadow}4d`
            ]
          }}
          transition={{
            boxShadow: { repeat: Infinity, duration: config.shadowDuration }
          }}
          exit={{ opacity: 0, scale: 0.5, x: -20 }}
          key="streak-display"
        >
          <motion.div
            animate={{ scale: config.scale }}
            transition={{ repeat: Infinity, duration: config.flameDuration }}
          >
            <Flame size={24} color={config.color} fill={config.color} />
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <motion.span
                key={streak}
                initial={{ scale: 1.5, color: '#fff' }}
                animate={{ scale: 1, color: config.color }}
                className="streak-count"
                style={{ textShadow: `0 0 10px ${config.shadow}` }}
            >
                {streak}
            </motion.span>
            <motion.span
                key={config.label}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="streak-label"
                style={{ color: '#aaa' }}
            >
                {config.label}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
