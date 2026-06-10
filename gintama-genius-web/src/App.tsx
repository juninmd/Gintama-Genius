import { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { useGameLogic } from './hooks/useGameLogic';
import { useScoreHistory } from './hooks/useScoreHistory';
import { useAchievements } from './hooks/useAchievements';
import Menu from './components/Menu';
import GameBoard from './components/GameBoard';
import { TurnIndicator, StreakBadge, UrgentIndicator } from './components/hud';
import { useAppKeyboard } from './hooks/game/useAppKeyboard';
import { AppModals } from './components/AppModals';
import { AppButtons } from './components/AppButtons';
import { AppHUD } from './components/AppHUD';

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

  useAppKeyboard(gameState, showShortcuts, setShowShortcuts, showHistory, setShowHistory, togglePause, toggleMute);

  return (
    <div className={`app-container ${isUrgent ? 'urgent-pulse' : ''} ${isError ? 'flash-error' : ''} ${isFever ? 'fever-mode-active' : ''}`} >

      <AppButtons
        showDebugTools={showDebugTools}
        debugActions={debugActions}
        setShowShortcuts={setShowShortcuts}
        setShowHistory={setShowHistory}
        gameState={gameState}
        score={score}
        level={level}
        timeLeft={timeLeft}
        sequence={sequence}
        userInputIndex={userInputIndex}
        activeColor={activeColor}
      />

      <AppHUD
        gameState={gameState}
        score={score}
        level={level}
        timeLeft={timeLeft}
        difficulty={settings.difficulty}
        isMuted={isMuted}
        toggleMute={toggleMute}
        countdownValue={countdownValue}
        feedback={feedback}
        streak={streak}
        kaguraActive={kaguraActive}
      />

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

      <AppModals
        gameState={gameState}
        score={score}
        highScore={highScore}
        level={level}
        settings={settings}
        history={history}
        showShortcuts={showShortcuts}
        setShowShortcuts={setShowShortcuts}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        isMuted={isMuted}
        displayAchievement={displayAchievement}
        togglePause={togglePause}
        startGame={startGame}
        resetGame={resetGame}
        toggleMute={toggleMute}
        clearHistory={clearHistory}
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
