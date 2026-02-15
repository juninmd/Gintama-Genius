import { useState, useCallback, useRef, useEffect } from 'react';
import type { TimeMode } from '../../constants';

const getInitialTime = (mode: TimeMode): number => {
  switch (mode) {
    case '30s': return 30;
    case '60s': return 60;
    case '120s': return 120;
    case '240s': return 240;
    case 'INFINITE': return Infinity;
    default: return 60;
  }
};

export const useGameTimer = (timeMode: TimeMode, onTimeUp: () => void) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [countdownValue, setCountdownValue] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    clearTimer();
    setTimeLeft(getInitialTime(timeMode));
  }, [timeMode, clearTimer]);

  const startTimer = useCallback(() => {
    clearTimer();
    if (timeMode === 'INFINITE') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [timeMode, clearTimer, onTimeUp]);

  const startCountdown = useCallback((startFrom: number) => {
    setCountdownValue(startFrom);
  }, []);

  // Countdown effect
  useEffect(() => {
    if (countdownValue > 0) {
      const timer = setTimeout(() => setCountdownValue((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdownValue]);

  // Clean up on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    timeLeft,
    setTimeLeft,
    countdownValue,
    startTimer,
    resetTimer,
    clearTimer,
    startCountdown
  };
};
