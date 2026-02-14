import { useState, useEffect, useCallback, useRef } from 'react';
import { audioController } from '../utils/audio';
import {
  MESSAGES_SUCCESS,
  MESSAGES_ERROR,
  MESSAGES_NEW_ROUND,
  type Difficulty,
  type TimeMode
} from '../constants';

export type GameState = 'IDLE' | 'PLAYING_SEQUENCE' | 'WAITING_FOR_INPUT' | 'GAME_OVER' | 'COUNTDOWN';

export interface Feedback {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface UseGameLogicReturn {
  gameState: GameState;
  score: number;
  level: number;
  timeLeft: number;
  activeColor: number | null;
  sequence: number[];
  userInputIndex: number;
  settings: {
    difficulty: Difficulty;
    timeMode: TimeMode;
  };
  kaguraActive: boolean;
  streak: number;
  highScore: number;
  feedback: Feedback | null;
  countdownValue: number;
  isMuted: boolean;
  toggleMute: () => void;
  startGame: (difficulty: Difficulty, timeMode: TimeMode) => void;
  handleColorClick: (color: number) => void;
  resetGame: () => void;
  debugActions: {
    isDebug: boolean;
    toggleDebug: () => void;
    addScore: (amount: number) => void;
    triggerBonus: () => void;
    setGameOver: () => void;
    setTimer: (seconds: number) => void;
    winLevel: () => void;
  };
}

const getRandomMessage = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

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

export const useGameLogic = (): UseGameLogicReturn => {
  const initialHighScore = (() => {
    try {
      return Number(localStorage.getItem('gintama_highscore')) || 0;
    } catch {
      return 0;
    }
  })();

  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInputIndex, setUserInputIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [settings, setSettings] = useState<{ difficulty: Difficulty; timeMode: TimeMode }>({
    difficulty: 'NORMAL',
    timeMode: '60s',
  });
  const [kaguraActive, setKaguraActive] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(initialHighScore);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [countdownValue, setCountdownValue] = useState(0);
  const [isMuted, setIsMuted] = useState(audioController.muted);
  const [playbackIndex, setPlaybackIndex] = useState<number>(-1);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const feedbackTokenRef = useRef(0);
  const inputLockedRef = useRef(false);
  const kaguraCountRef = useRef(0);
  const streakRef = useRef(0);
  const scoreRef = useRef(0);
  const highScoreRef = useRef(initialHighScore);
  const userInputIndexRef = useRef(0);

  const clearGameTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearScheduledTimeouts = useCallback(() => {
    timeoutRefs.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutRefs.current = [];
  }, []);

  const scheduleTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      timeoutRefs.current = timeoutRefs.current.filter((id) => id !== timeoutId);
      callback();
    }, delay);
    timeoutRefs.current.push(timeoutId);
    return timeoutId;
  }, []);

  const setStreakValue = useCallback((value: number) => {
    streakRef.current = value;
    setStreak(value);
  }, []);

  const setScoreValue = useCallback((value: number) => {
    scoreRef.current = value;
    setScore(value);
  }, []);

  const setUserInputIndexValue = useCallback((value: number) => {
    userInputIndexRef.current = value;
    setUserInputIndex(value);
  }, []);

  const showFeedback = useCallback((nextFeedback: Feedback, durationMs = 0) => {
    const token = ++feedbackTokenRef.current;
    setFeedback(nextFeedback);

    if (durationMs > 0) {
      scheduleTimeout(() => {
        if (feedbackTokenRef.current === token) {
          setFeedback(null);
        }
      }, durationMs);
    }
  }, [scheduleTimeout]);

  const addScore = useCallback((amount: number) => {
    const nextScore = scoreRef.current + amount;
    setScoreValue(nextScore);

    if (nextScore > highScoreRef.current) {
      highScoreRef.current = nextScore;
      setHighScore(nextScore);
      try {
        localStorage.setItem('gintama_highscore', nextScore.toString());
      } catch (e) {
        console.warn(e);
      }
    }
  }, [setScoreValue]);

  const toggleMute = () => {
    const newState = audioController.toggleMute();
    setIsMuted(newState);
  };

  useEffect(() => {
    const unlockAudio = () => audioController.resume();
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('pointerdown', unlockAudio);
    };
  }, []);

  useEffect(() => {
    return () => {
      clearGameTimer();
      clearScheduledTimeouts();
    };
  }, [clearGameTimer, clearScheduledTimeouts]);

  const playSound = useCallback((key: string | number) => {
    audioController.play(key);
  }, []);

  const triggerKaguraBonus = useCallback(() => {
    if (settings.difficulty === 'BERSERK') return;

    kaguraCountRef.current += 1;
    if (kaguraCountRef.current < 30) return;

    kaguraCountRef.current = 0;
    if (settings.timeMode !== 'INFINITE') {
      setTimeLeft((prevTime) => (Number.isFinite(prevTime) ? prevTime + 30 : prevTime));
    }

    addScore(10);
    playSound('vapo');
    setKaguraActive(true);
    scheduleTimeout(() => setKaguraActive(false), 2000);
  }, [addScore, playSound, scheduleTimeout, settings.difficulty, settings.timeMode]);

  const addToSequence = useCallback(() => {
    const nextColor = Math.floor(Math.random() * 4) + 1;
    setSequence((prev) => [...prev, nextColor]);
    setPlaybackIndex(-1);

    scheduleTimeout(() => {
      showFeedback({ message: getRandomMessage(MESSAGES_NEW_ROUND), type: 'info' }, 1500);
    }, 200);
  }, [scheduleTimeout, showFeedback]);

  const startGame = useCallback((difficulty: Difficulty, timeMode: TimeMode) => {
    clearGameTimer();
    clearScheduledTimeouts();

    inputLockedRef.current = true;
    kaguraCountRef.current = 0;
    setStreakValue(0);
    setScoreValue(0);
    setUserInputIndexValue(0);
    setLevel(0);
    setSequence([]);
    setKaguraActive(false);
    setPlaybackIndex(-1);
    setTimeLeft(getInitialTime(timeMode));
    feedbackTokenRef.current += 1;
    setFeedback(null);
    setSettings({ difficulty, timeMode });

    playSound('novo');

    const firstColor = Math.floor(Math.random() * 4) + 1;
    setSequence([firstColor]);
    setGameState('COUNTDOWN');
    setCountdownValue(3);
  }, [
    clearGameTimer,
    clearScheduledTimeouts,
    playSound,
    setScoreValue,
    setStreakValue,
    setUserInputIndexValue,
  ]);

  useEffect(() => {
    if (gameState !== 'COUNTDOWN') return;

    if (countdownValue > 0) {
      const timer = setTimeout(() => setCountdownValue((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }

    const transitionTimer = setTimeout(() => {
      setGameState('PLAYING_SEQUENCE');
      showFeedback({ message: getRandomMessage(MESSAGES_NEW_ROUND), type: 'info' }, 1500);
    }, 0);
    return () => clearTimeout(transitionTimer);
  }, [gameState, countdownValue, showFeedback]);

  useEffect(() => {
    clearGameTimer();

    if (
      gameState === 'IDLE' ||
      gameState === 'GAME_OVER' ||
      gameState === 'COUNTDOWN' ||
      settings.timeMode === 'INFINITE'
    ) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          inputLockedRef.current = true;
          setGameState('GAME_OVER');
          playSound('gameOver');
          showFeedback({ message: 'Tempo Esgotado!', type: 'error' });
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return clearGameTimer;
  }, [gameState, settings.timeMode, clearGameTimer, playSound, showFeedback]);

  useEffect(() => {
    if (gameState !== 'PLAYING_SEQUENCE') return;

    if (playbackIndex === -1) {
      const timer = setTimeout(() => setPlaybackIndex(0), 1000);
      return () => clearTimeout(timer);
    }

    if (playbackIndex >= sequence.length) {
      const timer = setTimeout(() => {
        setGameState('WAITING_FOR_INPUT');
        setUserInputIndexValue(0);
        setActiveColor(null);
        inputLockedRef.current = false;
      }, 0);
      return () => clearTimeout(timer);
    }

    const color = sequence[playbackIndex];
    let isMounted = true;

    const lightUpTimeout = setTimeout(() => {
      if (!isMounted) return;
      setActiveColor(color);
      playSound(color);
    }, 100);

    const clearLightTimeout = setTimeout(() => {
      if (!isMounted) return;
      setActiveColor(null);
    }, 600);

    const nextStepTimeout = setTimeout(() => {
      if (!isMounted) return;
      setPlaybackIndex((prev) => prev + 1);
    }, 900);

    return () => {
      isMounted = false;
      setActiveColor(null);
      clearTimeout(lightUpTimeout);
      clearTimeout(clearLightTimeout);
      clearTimeout(nextStepTimeout);
    };
  }, [gameState, playbackIndex, sequence, playSound, setUserInputIndexValue]);

  useEffect(() => {
    if (gameState !== 'GAME_OVER') return;
    inputLockedRef.current = true;
    clearScheduledTimeouts();
  }, [gameState, clearScheduledTimeouts]);

  const handleColorClick = useCallback((color: number) => {
    if (gameState !== 'WAITING_FOR_INPUT' || inputLockedRef.current) return;

    const expectedColor = sequence[userInputIndexRef.current];
    if (expectedColor == null) return;

    playSound(color);

    if (color !== expectedColor) {
      inputLockedRef.current = true;
      setGameState('GAME_OVER');
      playSound('gameOver');

      if (streakRef.current > 5) {
        showFeedback({ message: 'COMBO QUEBRADO!', type: 'error' });
      } else {
        showFeedback({ message: getRandomMessage(MESSAGES_ERROR), type: 'error' });
      }

      setStreakValue(0);
      return;
    }

    addScore(1);
    triggerKaguraBonus();

    const nextIndex = userInputIndexRef.current + 1;
    setUserInputIndexValue(nextIndex);
    const nextStreak = streakRef.current + 1;
    setStreakValue(nextStreak);

    if (nextIndex !== sequence.length) return;

    inputLockedRef.current = true;
    setLevel((prev) => prev + 1);

    if (nextStreak % 5 === 0) {
      showFeedback({ message: 'SEQUÊNCIA DE ACERTOS!', type: 'success' }, 1000);
    } else if (nextStreak <= 3) {
      showFeedback({ message: getRandomMessage(['VOCÊ ACERTOU!', 'BOA!', 'ISSO AÍ!']), type: 'success' }, 1000);
    } else if (Math.random() < 0.4) {
      showFeedback({ message: getRandomMessage(MESSAGES_SUCCESS), type: 'success' }, 1000);
    }

    if (settings.difficulty === 'BERSERK' && Math.random() < 0.3) {
      showFeedback({ message: 'Incrível!', type: 'success' }, 1000);
    }

    scheduleTimeout(() => {
      setGameState('PLAYING_SEQUENCE');
      addToSequence();
    }, 1000);
  }, [
    gameState,
    sequence,
    playSound,
    showFeedback,
    setStreakValue,
    addScore,
    triggerKaguraBonus,
    setUserInputIndexValue,
    settings.difficulty,
    addToSequence,
    scheduleTimeout,
  ]);

  const resetGame = useCallback(() => {
    clearGameTimer();
    clearScheduledTimeouts();

    inputLockedRef.current = false;
    kaguraCountRef.current = 0;
    setGameState('IDLE');
    setScoreValue(0);
    setLevel(0);
    setSequence([]);
    setStreakValue(0);
    setUserInputIndexValue(0);
    setFeedback(null);
    feedbackTokenRef.current += 1;
    setPlaybackIndex(-1);
    setKaguraActive(false);
    setCountdownValue(0);
    setActiveColor(null);
  }, [
    clearGameTimer,
    clearScheduledTimeouts,
    setScoreValue,
    setStreakValue,
    setUserInputIndexValue,
  ]);

  const debugActions = {
    isDebug: debugMode,
    toggleDebug: () => setDebugMode((prev) => !prev),
    addScore: (amount: number) => addScore(amount),
    triggerBonus: () => {
      setKaguraActive(true);
      playSound('vapo');
      scheduleTimeout(() => setKaguraActive(false), 2000);
    },
    setGameOver: () => {
      inputLockedRef.current = true;
      setGameState('GAME_OVER');
      playSound('gameOver');
    },
    setTimer: (seconds: number) => setTimeLeft(seconds),
    winLevel: () => {
      if (gameState === 'IDLE' || gameState === 'GAME_OVER') return;

      addScore(10);
      setLevel((prev) => prev + 1);
      inputLockedRef.current = true;
      scheduleTimeout(() => {
        setGameState('PLAYING_SEQUENCE');
        addToSequence();
      }, 500);
    },
  };

  return {
    gameState,
    score,
    level,
    timeLeft,
    activeColor,
    sequence,
    userInputIndex,
    settings,
    kaguraActive,
    streak,
    highScore,
    feedback,
    countdownValue,
    isMuted,
    toggleMute,
    startGame,
    handleColorClick,
    resetGame,
    debugActions,
  };
};
