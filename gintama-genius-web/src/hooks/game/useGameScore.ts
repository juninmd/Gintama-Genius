import { useState, useCallback, useRef } from 'react';

const HIGHSCORE_KEY = 'gintama_highscore';

export const useGameScore = () => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem(HIGHSCORE_KEY)) || 0;
    } catch {
      return 0;
    }
  });

  const scoreRef = useRef(0);
  const streakRef = useRef(0);
  const highScoreRef = useRef(highScore);

  const resetScore = useCallback(() => {
    setScore(0);
    scoreRef.current = 0;
    setStreak(0);
    streakRef.current = 0;
  }, []);

  const addScore = useCallback((amount: number) => {
    const nextScore = scoreRef.current + amount;
    setScore(nextScore);
    scoreRef.current = nextScore;

    if (nextScore > highScoreRef.current) {
      setHighScore(nextScore);
      highScoreRef.current = nextScore;
      try {
        localStorage.setItem(HIGHSCORE_KEY, nextScore.toString());
      } catch (e) {
        console.warn(e);
      }
    }
  }, []);

  const incrementStreak = useCallback(() => {
    const nextStreak = streakRef.current + 1;
    setStreak(nextStreak);
    streakRef.current = nextStreak;
    return nextStreak;
  }, []);

  const resetStreak = useCallback(() => {
    setStreak(0);
    streakRef.current = 0;
  }, []);

  return {
    score,
    streak,
    highScore,
    resetScore,
    addScore,
    incrementStreak,
    resetStreak,
    scoreRef,
    streakRef
  };
};
