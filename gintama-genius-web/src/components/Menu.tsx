import React from 'react';
import type { Difficulty, TimeMode } from '../hooks/useGameLogic';

interface MenuProps {
  onStart: (difficulty: Difficulty, timeMode: TimeMode) => void;
}

const Menu: React.FC<MenuProps> = ({ onStart }) => {
  const [difficulty, setDifficulty] = React.useState<Difficulty>('NORMAL');
  const [timeMode, setTimeMode] = React.useState<TimeMode>('60s');

  return (
    <div className="menu-container">
      <img src="/assets/images/splash.png" alt="Gintama Genius" className="splash-image" />
      <div className="menu-controls">
        <div className="setting-group">
          <label>Dificuldade:</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
            <option value="BERSERK">Berserk (Difícil)</option>
            <option value="NORMAL">Normal</option>
            <option value="EASY">Fácil</option>
          </select>
        </div>
        <div className="setting-group">
          <label>Tempo:</label>
          <select value={timeMode} onChange={(e) => setTimeMode(e.target.value as TimeMode)}>
            <option value="30s">30s</option>
            <option value="60s">60s</option>
            <option value="120s">120s</option>
            <option value="240s">240s</option>
            <option value="INFINITE">Infinito</option>
          </select>
        </div>
        <button
          className="start-button"
          onClick={() => onStart(difficulty, timeMode)}
          style={{
            backgroundImage: 'url(/assets/images/iniciar.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '60px', // Ensure enough height for the image
            color: 'transparent' // Hide text if image has text, or we can overlay text if needed. Image likely has "Iniciar" text.
          }}
          aria-label="Iniciar Jogo"
        >
        </button>
      </div>
    </div>
  );
};

export default Menu;
