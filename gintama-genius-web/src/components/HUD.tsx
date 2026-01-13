import React from 'react';

interface HUDProps {
  score: number;
  level: number;
  timeLeft: number;
  difficulty: string;
  message: string | null;
}

const HUD: React.FC<HUDProps> = ({ score, level, timeLeft, difficulty, message }) => {
  return (
    <>
      <div className="hud">
        <div className="hud-group">
            <div className="hud-item"><span>🏆</span> {score}</div>
            <div className="hud-item"><span>🆙</span> {level}</div>
        </div>
        <div className="hud-group">
            <div className="hud-item"><span>⏳</span> {timeLeft === Infinity ? '∞' : timeLeft}s</div>
            <div className="hud-item"><span>⚙️</span> {difficulty}</div>
        </div>
      </div>
      {message && (
          <div className="message-overlay">
              <h2 className="glow-text">{message}</h2>
          </div>
      )}
    </>
  );
};

export default HUD;
