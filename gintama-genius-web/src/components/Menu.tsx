import React, { useEffect } from 'react';
import type { Difficulty, TimeMode } from '../hooks/useGameLogic';

interface MenuProps {
  onStart: (difficulty: Difficulty, timeMode: TimeMode) => void;
  speakIntro: () => void;
}

const Menu: React.FC<MenuProps> = ({ onStart, speakIntro }) => {
  const [difficulty, setDifficulty] = React.useState<Difficulty>('NORMAL');
  const [timeMode, setTimeMode] = React.useState<TimeMode>('60s');

  useEffect(() => {
    // Try to speak immediately, but also attach to first interaction if blocked
    const handleInteraction = () => {
        speakIntro();
        window.removeEventListener('click', handleInteraction);
        window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
        window.removeEventListener('click', handleInteraction);
        window.removeEventListener('touchstart', handleInteraction);
    };
  }, [speakIntro]);

  return (
    <div className="menu-container">
      <img src="/assets/images/splash.png" alt="Splash" className="splash-image" />
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
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat'
          }}
        >
        </button>
      </div>
    </div>
  );
};

export default Menu;
