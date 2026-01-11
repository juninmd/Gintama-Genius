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
      <div className="hud-item">Points: {score}</div>
      <div className="hud-item">Level: {level}</div>
      <div className="hud-item">Time: {timeLeft === Infinity ? '∞' : timeLeft}</div>
      <div className="hud-item">Mode: {difficulty}</div>
    </div>
  );
};

export default HUD;
