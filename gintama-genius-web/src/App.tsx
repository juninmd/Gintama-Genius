import './App.css';
import { useGameLogic } from './hooks/useGameLogic';
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

function App() {
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
  } = useGameLogic();

  const isUrgent = timeLeft <= 10 && gameState !== 'IDLE' && gameState !== 'GAME_OVER' && settings.timeMode !== 'INFINITE';
  const isError = feedback?.type === 'error';

  return (
    <div className={`app-container ${isUrgent ? 'urgent-pulse' : ''}`} >

      <button
        className="debug-toggle"
        onClick={debugActions.toggleDebug}
        style={{ position: 'absolute', top: 5, right: 5, zIndex: 1000, opacity: 0.3, background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '24px' }}
      >
        🐞
      </button>

      {debugActions.isDebug && (
        <DebugPanel
          state={{ gameState, score, level, timeLeft, sequence, userInputIndex, activeColor }}
          actions={debugActions}
        />
      )}

      {/* Header (Score/Time) - Fixed at top */}
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

      {/* Main Game Area */}
      <div className="game-layout">
        {gameState === 'IDLE' ? (
          <Menu onStart={startGame} />
        ) : (
          <>
            {/* Turn Indicator sits physically above the board now */}
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

             {/* Footer area for HUD elements */}
             <div className="hud-footer">
                <UrgentIndicator visible={isUrgent} />
                <StreakBadge streak={streak} />
             </div>
          </>
        )}
      </div>

      {/* Overlays */}
      {gameState !== 'IDLE' && (
        <>
            {gameState === 'COUNTDOWN' && <Countdown value={countdownValue} />}
            <NewRoundBanner feedback={feedback} />
            <FeedbackOverlay feedback={feedback} streak={streak} />

            {kaguraActive && (
                <div className="kagura-bonus">
                   <img src="/assets/images/uow.png" alt="Bonus!" />
                </div>
            )}
        </>
      )}

      {gameState === 'GAME_OVER' && (
        <GameOver score={score} highScore={highScore} onRestart={resetGame} />
      )}
    </div>
  );
}

export default App;
