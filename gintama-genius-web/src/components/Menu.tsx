import React from 'react';
import type { Difficulty, TimeMode } from '../constants';

interface MenuProps {
  onStart: (difficulty: Difficulty, timeMode: TimeMode) => void;
}

const Menu: React.FC<MenuProps> = ({ onStart }) => {
  const [difficulty, setDifficulty] = React.useState<Difficulty>('NORMAL');
  const [timeMode, setTimeMode] = React.useState<TimeMode>('60s');

  const [imageError, setImageError] = React.useState(false);

  return (
    <div className="menu-container">
      {!imageError ? (
          <img
            src="/assets/images/splash.png"
            alt="Gintama Genius"
            className="splash-image"
            onError={() => setImageError(true)}
          />
      ) : (
          <h1 className="menu-title">Yorozuya Training</h1>
      )}

      <div className="menu-controls">
        <div className="setting-group">
          <label>Nível:</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
            <option value="BERSERK">Yato (Difícil)</option>
            <option value="NORMAL">Samurai (Normal)</option>
            <option value="EASY">Shinpachi (Fácil)</option>
          </select>
        </div>
        <div className="setting-group">
          <label>Tempo:</label>
          <select value={timeMode} onChange={(e) => setTimeMode(e.target.value as TimeMode)}>
            <option value="30s">30s (Flash)</option>
            <option value="60s">60s (Padrão)</option>
            <option value="120s">120s (Longo)</option>
            <option value="240s">240s (Maratona)</option>
            <option value="INFINITE">Sem Tempo</option>
          </select>
        </div>
        <button
          className="start-button"
          onClick={() => onStart(difficulty, timeMode)}
          aria-label="Iniciar Jogo"
        >
          Iniciar Missão
        </button>
      </div>
    </div>
  );
};

export default Menu;
