import './App.css';
import { useGameLogic } from './hooks/useGameLogic';
import Menu from './components/Menu';
import GameBoard from './components/GameBoard';
import GameHUD from './components/GameHUD';
import GameOver from './components/GameOver';
import DebugPanel from './components/DebugPanel';

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
    debugActions,
    message,
    streak,
    speakIntro,
    startGame,
    handleColorClick,
    resetGame,
  } = useGameLogic();

  return (
    <div className="app-container" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/fundo.png')` }}>

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

      {gameState === 'IDLE' && (
        <Menu onStart={startGame} speakIntro={speakIntro} />
      )}

      {gameState !== 'IDLE' && (
        <>
          <GameHUD
            score={score}
            level={level}
            timeLeft={timeLeft}
            difficulty={settings.difficulty}
            message={message}
            streak={streak}
            gameState={gameState}
          />

          <div className="game-area">
             <GameBoard
               activeColor={activeColor}
               onColorClick={handleColorClick}
               disabled={gameState !== 'WAITING_FOR_INPUT'}
             />
          </div>

          {kaguraActive && (
            <div className="kagura-bonus">
               <img src="/assets/images/uow.png" alt="Bonus!" />
            </div>
          )}
        </>
      )}

      {gameState === 'GAME_OVER' && (
        <GameOver score={score} onRestart={resetGame} />
      )}
    </div>
  );
}

export default App;
