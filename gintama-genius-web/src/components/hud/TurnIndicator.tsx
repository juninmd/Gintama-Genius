import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, MousePointerClick } from 'lucide-react';
import type { GameState } from '../../hooks/useGameLogic';

interface TurnIndicatorProps {
  gameState: GameState;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ gameState }) => {
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
