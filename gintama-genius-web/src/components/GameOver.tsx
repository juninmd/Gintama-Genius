import React from 'react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  return (
    <div className="game-over-overlay" style={{
        backgroundImage: 'url(/assets/images/gameover.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    }}>
      <div className="game-over-content">
        <h1>Fim de Jogo</h1>
        <p>Você fez {score} pontos!</p>
        <button onClick={onRestart} className="restart-button">Jogar Novamente</button>
      </div>
    </div>
  );
};

export default GameOver;
