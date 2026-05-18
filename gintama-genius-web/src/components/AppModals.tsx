import React from 'react';
import { PauseMenu } from './PauseMenu';
import { AchievementToast } from './hud/AchievementToast';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import { ScoreHistoryPanel } from './ScoreHistoryPanel';
import { GameOverWithHistory } from './GameOverWithHistory';
import type { GameState, Difficulty, TimeMode } from '../constants';
import type { ScoreEntry } from '../hooks/useScoreHistory';
import type { Achievement } from '../hooks/useAchievements';

interface AppModalsProps {
  gameState: GameState;
  score: number;
  highScore: number;
  level: number;
  settings: { difficulty: Difficulty; timeMode: TimeMode };
  history: ScoreEntry[];
  showShortcuts: boolean;
  setShowShortcuts: React.Dispatch<React.SetStateAction<boolean>>;
  showHistory: boolean;
  setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;
  isMuted: boolean;
  displayAchievement: Achievement | null | boolean;
  togglePause: () => void;
  startGame: (difficulty: Difficulty, timeMode: TimeMode) => void;
  resetGame: () => void;
  toggleMute: () => void;
  clearHistory: () => void;
}

export const AppModals: React.FC<AppModalsProps> = ({
  gameState, score, highScore, level, settings, history,
  showShortcuts, setShowShortcuts, showHistory, setShowHistory,
  isMuted, displayAchievement, togglePause, startGame, resetGame,
  toggleMute, clearHistory
}) => {
  return (
    <>
      {gameState === 'GAME_OVER' && (
        <GameOverWithHistory
          score={score}
          highScore={highScore}
          onRestart={resetGame}
          level={level}
          settings={settings}
        />
      )}

      <PauseMenu
        isOpen={gameState === 'PAUSED'}
        onResume={togglePause}
        onRestart={() => { togglePause(); startGame(settings.difficulty, settings.timeMode); }}
        onQuit={resetGame}
        onToggleSound={toggleMute}
        isMuted={isMuted}
      />

      <AchievementToast achievement={displayAchievement} />

      <KeyboardShortcutsHelp
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      <ScoreHistoryPanel
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onClear={clearHistory}
      />
    </>
  );
};
