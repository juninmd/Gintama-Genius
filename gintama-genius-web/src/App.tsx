import { useEffect, useCallback, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { useGameLogic } from './hooks/useGameLogic';
import { useScoreHistory } from './hooks/useScoreHistory';
import { useAchievements } from './hooks/useAchievements';
import Menu from './components/Menu';
import GameBoard from './components/GameBoard';
import {
  HUDHeader,
  TurnIndicator,
  StreakBadge,
  FeedbackOverlay,
  UrgentIndicator,
  NewRoundBanner
} from './components/hud';
import GameOver from './components/GameOver';
import DebugPanel from './components/DebugPanel';
import Countdown from './components/Countdown';
import { PauseMenu } from './components/PauseMenu';
import { AchievementToast } from './components/hud/AchievementToast';
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp';
import { ScoreHistoryPanel } from './components/ScoreHistoryPanel';

const GameOverWithHistory: React.FC<{
  score: number;
  highScore: number;
  onRestart: () => void;
  level: number;
  settings: { difficulty: string; timeMode: string };
}> = ({ score, highScore, onRestart, level, settings }) => {
  const { addEntry } = useScoreHistory();

  useEffect(() => {
    if (score > 0) {
      addEntry({ score, difficulty: settings.difficulty, timeMode: settings.timeMode, level });
    }
  }, [score, level, settings.difficulty, settings.timeMode, addEntry]);

  return <GameOver score={score} highScore={highScore} onRestart={onRestart} />;
};

const AppContent: React.FC = () => {
  const {
    gameState,
    score,
    level,
    timeLeft,
    activeColor,
    settings,
    kaguraActive,
    sequence,
    userInputIndex,
    streak,
    highScore,
    feedback,
    countdownValue,
    isMuted,
    toggleMute,
    debugActions,
    startGame,
    handleColorClick,
    resetGame,
    togglePause,
    recentlyUnlocked,
  } = useGameLogic();

  const { history, clearHistory } = useScoreHistory();
  const { recentlyUnlocked: achievementUnlocked } = useAchievements();

  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const isUrgent = timeLeft <= 10 && gameState !== 'IDLE' && gameState !== 'GAME_OVER' && gameState !== 'PAUSED' && settings.timeMode !== 'INFINITE';
  const isError = feedback?.type === 'error';
  const isFever = streak >= 10;
  const showDebugTools = import.meta.env.DEV;

  const displayAchievement = achievementUnlocked || recentlyUnlocked;

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
  }, [gameState, showShortcuts, showHistory, togglePause, toggleMute]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={`app-container ${isUrgent ? 'urgent-pulse' : ''} ${isError ? 'flash-error' : ''} ${isFever ? 'fever-mode-active' : ''}`} >

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

      {gameState !== 'IDLE' && (
        <HUDHeader
          score={score}
          level={level}
          timeLeft={timeLeft}
          difficulty={settings.difficulty}
          isMuted={isMuted}
          toggleMute={toggleMute}
        />
      )}

      <div className="game-layout">
        {gameState === 'IDLE' ? (
          <Menu onStart={startGame} />
        ) : (
          <>
            <div className="indicator-area">
                <TurnIndicator gameState={gameState} />
            </div>

            <div className={`board-area ${isError ? 'shake-screen' : ''}`}>
               <GameBoard
                 activeColor={activeColor}
                 onColorClick={handleColorClick}
                 disabled={gameState !== 'WAITING_FOR_INPUT'}
               />
            </div>

             <div className="hud-footer">
                <UrgentIndicator visible={isUrgent} />
                <StreakBadge streak={streak} />
             </div>
          </>
        )}
      </div>

      {gameState !== 'IDLE' && (
        <>
            {gameState === 'COUNTDOWN' && <Countdown value={countdownValue} />}
            <NewRoundBanner feedback={feedback} />
            <FeedbackOverlay feedback={feedback} streak={streak} />

            {kaguraActive && (
                <div className="kagura-bonus">
                   <img src="/assets/images/uow.png" alt="Bônus Kagura" />
                </div>
            )}
        </>
      )}

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
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
