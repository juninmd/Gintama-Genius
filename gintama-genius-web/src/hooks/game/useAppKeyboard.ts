import { useEffect, useCallback } from 'react';
import type { GameState } from '../../constants';

export const useAppKeyboard = (
  gameState: GameState,
  showShortcuts: boolean,
  setShowShortcuts: React.Dispatch<React.SetStateAction<boolean>>,
  showHistory: boolean,
  setShowHistory: React.Dispatch<React.SetStateAction<boolean>>,
  togglePause: () => void,
  toggleMute: () => void
) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (showShortcuts) {
        setShowShortcuts(false);
      } else if (showHistory) {
        setShowHistory(false);
      } else if (gameState === 'PAUSED') {
        togglePause();
      } else if (gameState !== 'IDLE' && gameState !== 'GAME_OVER' && gameState !== 'COUNTDOWN') {
        togglePause();
      }
    }

    if (e.key === 'h' || e.key === 'H') {
      if (!['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        setShowShortcuts(prev => !prev);
      }
    }

    if (e.key === 'm' || e.key === 'M') {
      if (!['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        toggleMute();
      }
    }
  }, [gameState, showShortcuts, showHistory, togglePause, toggleMute, setShowHistory, setShowShortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
