import React from 'react';

interface HUDProps {
  score: number;
  level: number;
  timeLeft: number;
  difficulty: string;
}

const HUD: React.FC<HUDProps> = ({ score, level, timeLeft, difficulty }) => {
  return (
    <div className="hud">
      <div className="hud-item"><span>🏆</span> {score}</div>
      <div className="hud-item"><span>🆙</span> {level}</div>
      <div className="hud-item"><span>⏳</span> {timeLeft === Infinity ? '∞' : timeLeft}s</div>
      <div className="hud-item"><span>⚙️</span> {difficulty}</div>
    </div>
  );
};

export default HUD;
