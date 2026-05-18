import React, { useEffect } from 'react';
import { useScoreHistory } from '../hooks/useScoreHistory';
import GameOver from './GameOver';

interface GameOverWithHistoryProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  level: number;
  settings: { difficulty: string; timeMode: string };
}

export const GameOverWithHistory: React.FC<GameOverWithHistoryProps> = ({ score, highScore, onRestart, level, settings }) => {
  const { addEntry } = useScoreHistory();

  useEffect(() => {
    if (score > 0) {
      addEntry({ score, difficulty: settings.difficulty, timeMode: settings.timeMode, level });
    }
  }, [score, level, settings.difficulty, settings.timeMode, addEntry]);

  return <GameOver score={score} highScore={highScore} onRestart={onRestart} />;
};
