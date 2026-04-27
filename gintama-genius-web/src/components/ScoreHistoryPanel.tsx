import React from 'react';
import { motion } from 'framer-motion';
import type { ScoreEntry } from '../hooks/useScoreHistory';

interface ScoreHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScoreEntry[];
  onClear: () => void;
}

export const ScoreHistoryPanel: React.FC<ScoreHistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="history-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="history-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
      >
        <h2>Histórico de Pontuações</h2>

        {history.length === 0 ? (
          <p className="history-empty">Nenhuma partida registrada ainda.</p>
        ) : (
          <>
            <div className="history-list">
              {history.map((entry, index) => (
                <motion.div
                  key={`${entry.date}-${index}`}
                  className="history-entry"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="entry-rank">#{index + 1}</div>
                  <div className="entry-info">
                    <div className="entry-score">{entry.score} pts</div>
                    <div className="entry-meta">
                      {entry.difficulty} • {entry.timeMode} • Nível {entry.level}
                    </div>
                    <div className="entry-date">{entry.date}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button onClick={onClear} className="history-clear">
              Limpar Histórico
            </button>
          </>
        )}

        <button onClick={onClose} className="history-close">Fechar</button>
      </motion.div>
    </motion.div>
  );
};
