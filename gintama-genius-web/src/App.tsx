import './App.css';
import { useGameLogic } from './hooks/useGameLogic';
import Menu from './components/Menu';
import GameBoard from './components/GameBoard';
import HUD from './components/HUD';
import GameOver from './components/GameOver';

function App() {
  const {
    gameState,
    score,
    level,
    timeLeft,
    activeColor,
    settings,
    kaguraActive,
    startGame,
    handleColorClick,
    resetGame,
  } = useGameLogic();

  return (
    <div className="app-container" style={{ backgroundImage: `url(/assets/images/fundo.png)` }}>
      {gameState === 'IDLE' && (
        <Menu onStart={startGame} />
      )}

      {gameState !== 'IDLE' && (
        <>
          <HUD
            score={score}
            level={level}
            timeLeft={timeLeft}
            difficulty={settings.difficulty}
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
