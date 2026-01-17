import React from 'react';
import { getRank } from '../hooks/useGameLogic';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  const rank = getRank(score);

  return (
    <div className="game-over-overlay" style={{ backgroundImage: 'url(/assets/images/gameover.png)' }}>
      <div className="game-over-content">
        <h1>Fim de Jogo</h1>
        <p className="final-score">Pontuação: {score}</p>

        <div className="rank-display">
          <h3 className="rank-title">{rank.title}</h3>
          <p className="rank-desc">{rank.description}</p>
        </div>

        <button onClick={onRestart} className="restart-button">Jogar Novamente</button>
      </div>
    </div>
  );
};

export default GameOver;
