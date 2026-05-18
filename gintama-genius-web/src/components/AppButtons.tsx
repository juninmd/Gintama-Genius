import React from 'react';
import type { GameState } from '../constants';
import DebugPanel from './DebugPanel';

interface AppButtonsProps {
  showDebugTools: boolean;
  debugActions: {
    isDebug: boolean;
    winLevel: () => void;
    addScore: (amount: number) => void;
    triggerBonus: () => void;
    setGameOver: () => void;
    setTimer: (seconds: number) => void;
    toggleDebug: () => void;
  };
  setShowShortcuts: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;
  gameState: GameState;
  score: number;
  level: number;
  timeLeft: number;
  sequence: number[];
  userInputIndex: number;
  activeColor: number | null;
}

export const AppButtons: React.FC<AppButtonsProps> = ({
  showDebugTools, debugActions, setShowShortcuts, setShowHistory, gameState,
  score, level, timeLeft, sequence, userInputIndex, activeColor
}) => {
  return (
    <>
      {showDebugTools && (
        <button
          className="debug-toggle"
          onClick={debugActions.toggleDebug}
          aria-label="Alternar debug"
        >
          🐞
        </button>
      )}

      <button
        className="shortcuts-toggle"
        onClick={() => setShowShortcuts(true)}
        aria-label="Atalhos do teclado"
        title="Pressione H para ver atalhos"
      >
        ❓
      </button>

      {gameState !== 'IDLE' && (
        <button
          className="history-toggle"
          onClick={() => setShowHistory(true)}
          aria-label="Histórico de pontuações"
          title="Ver histórico"
        >
          📊
        </button>
      )}

      {showDebugTools && debugActions.isDebug && (
        <DebugPanel
          state={{ gameState, score, level, timeLeft, sequence, userInputIndex, activeColor }}
          actions={debugActions}
        />
      )}
    </>
  );
};
