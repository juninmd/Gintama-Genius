import React from 'react';
import { motion } from 'framer-motion';

interface PauseMenuProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  onToggleSound: () => void;
  isMuted: boolean;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  isOpen,
  onResume,
  onRestart,
  onQuit,
  onToggleSound,
  isMuted,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="pause-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="pause-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <h2 className="pause-title">PAUSADO</h2>
        <p className="pause-hint">Pressione ESC para continuar</p>

        <div className="pause-buttons">
          <button onClick={onResume} className="pause-btn resume">
            <span className="btn-icon">▶️</span>
            Continuar
          </button>

          <button onClick={onToggleSound} className="pause-btn sound">
            <span className="btn-icon">{isMuted ? '🔇' : '🔊'}</span>
            {isMuted ? 'Ativar Som' : 'Desativar Som'}
          </button>

          <button onClick={onRestart} className="pause-btn restart">
            <span className="btn-icon">🔄</span>
            Reiniciar
          </button>

          <button onClick={onQuit} className="pause-btn quit">
            <span className="btn-icon">🚪</span>
            Sair
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
