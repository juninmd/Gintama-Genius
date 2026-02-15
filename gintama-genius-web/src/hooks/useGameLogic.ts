import { useState, useCallback, useEffect, useRef } from 'react';
import { useAudio } from './game/useAudio';
import { useGameScore } from './game/useGameScore';
import { useGameTimer } from './game/useGameTimer';
import { useGameSequence } from './game/useGameSequence';
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

const getRandomMessage = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const useGameLogic = () => {
  // --- Sub-hooks ---
  const { isMuted, toggleMute, playSound } = useAudio();
  const { score, streak, highScore, resetScore, addScore, incrementStreak, resetStreak } = useGameScore();
  const {
    sequence,
    userInputIndex,
    activeColor,
    isInputLocked,
    playbackIndex,
    addToSequence,
    resetSequence,
    playSequence,
    validateInput,
    setIsInputLocked
  } = useGameSequence(playSound);

  // --- Local State ---
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [level, setLevel] = useState(0);
  const [settings, setSettings] = useState<{ difficulty: Difficulty; timeMode: TimeMode }>({
    difficulty: 'NORMAL',
    timeMode: '60s',
  });
  const [kaguraActive, setKaguraActive] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const kaguraCountRef = useRef(0);
  const gameStateRef = useRef<GameState>('IDLE');

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Define showFeedback first to be used in onTimeUp
  const showFeedback = useCallback((nextFeedback: Feedback, durationMs = 0) => {
    setFeedback(nextFeedback);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);

    if (durationMs > 0) {
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback(null);
      }, durationMs);
    }
  }, []);

  const onTimeUp = useCallback(() => {
    if (gameStateRef.current !== 'IDLE' && gameStateRef.current !== 'GAME_OVER') {
        setGameState('GAME_OVER');
        playSound('gameOver');
        showFeedback({ message: 'Tempo Esgotado!', type: 'error' });
        setIsInputLocked(true);
    }
  }, [playSound, setIsInputLocked, showFeedback]);

  const {
    timeLeft,
    countdownValue,
    startTimer,
    resetTimer,
    clearTimer,
    startCountdown,
    setTimeLeft
  } = useGameTimer(settings.timeMode, onTimeUp);

  // --- Effects ---

  // Sync timer with settings change in IDLE
  useEffect(() => {
    if (gameState === 'IDLE') {
        resetTimer();
    }
  }, [settings.timeMode, resetTimer, gameState]);

  // Sync GameState with Sequence Playback
  useEffect(() => {
    if (gameState === 'PLAYING_SEQUENCE' && !isInputLocked && sequence.length > 0 && playbackIndex === -1) {
        setGameState('WAITING_FOR_INPUT');
    }
  }, [gameState, isInputLocked, sequence.length, playbackIndex]);

  // Handle Countdown Finish
  useEffect(() => {
    if (gameState === 'COUNTDOWN' && countdownValue === 0) {
      const timer = setTimeout(() => {
        setGameState('PLAYING_SEQUENCE');
        showFeedback({ message: getRandomMessage(MESSAGES_NEW_ROUND), type: 'info' }, 1500);
        startTimer();
        playSequence();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState, countdownValue, startTimer, playSequence, showFeedback]);

  // --- Logic ---

  const triggerKaguraBonus = useCallback(() => {
    if (settings.difficulty === 'BERSERK') return;

    kaguraCountRef.current += 1;
    if (kaguraCountRef.current < 30) return;

    kaguraCountRef.current = 0;
    if (settings.timeMode !== 'INFINITE') {
      setTimeLeft((prev) => (Number.isFinite(prev) ? prev + 30 : prev));
    }

    addScore(10);
    playSound('vapo');
    setKaguraActive(true);
    setTimeout(() => setKaguraActive(false), 2000);
  }, [settings.difficulty, settings.timeMode, setTimeLeft, addScore, playSound]);

  const startGame = useCallback((difficulty: Difficulty, timeMode: TimeMode) => {
    resetScore();
    resetSequence();
    // settings update will trigger resetTimer via effect
    setSettings({ difficulty, timeMode });

    setLevel(0);
    setKaguraActive(false);
    kaguraCountRef.current = 0;
    setFeedback(null);

    playSound('novo');
    addToSequence();

    setGameState('COUNTDOWN');
    startCountdown(3);
  }, [resetScore, resetSequence, setSettings, startCountdown, addToSequence, playSound]);

  const handleColorClick = useCallback((color: number) => {
     if (gameState !== 'WAITING_FOR_INPUT') return;

     playSound(color);

     const result = validateInput(color);

     if (result === 'wrong') {
        setGameState('GAME_OVER');
        playSound('gameOver');
        clearTimer();

        if (streak > 5) {
            showFeedback({ message: 'COMBO QUEBRADO!', type: 'error' });
        } else {
            showFeedback({ message: getRandomMessage(MESSAGES_ERROR), type: 'error' });
        }
        resetStreak();
        return;
     }

     addScore(1);
     const newStreak = incrementStreak();
     triggerKaguraBonus();

     if (result === 'complete') {
        setIsInputLocked(true);
        setLevel(prev => prev + 1);

        if (newStreak % 5 === 0) {
            showFeedback({ message: 'SEQUÊNCIA DE ACERTOS!', type: 'success' }, 1500);
        } else if (newStreak <= 3) {
            showFeedback({ message: getRandomMessage(['VOCÊ ACERTOU!', 'BOA!', 'ISSO AÍ!']), type: 'success' }, 1000);
        } else if (Math.random() < 0.4) {
             showFeedback({ message: getRandomMessage(MESSAGES_SUCCESS), type: 'success' }, 1000);
        }

        if (settings.difficulty === 'BERSERK' && Math.random() < 0.3) {
           showFeedback({ message: 'Incrível!', type: 'success' }, 1000);
        }

        setTimeout(() => {
             addToSequence();
             setGameState('PLAYING_SEQUENCE');
             playSequence();
        }, 1000);
     }
  }, [
    gameState, validateInput, playSound, clearTimer, streak,
    resetStreak, showFeedback, addScore, incrementStreak,
    triggerKaguraBonus, setIsInputLocked, addToSequence, playSequence, settings.difficulty
  ]);

  const resetGame = useCallback(() => {
    setGameState('IDLE');
    resetScore();
    resetSequence();
    clearTimer();
    setFeedback(null);
    setKaguraActive(false);
  }, [resetScore, resetSequence, clearTimer]);

  const [debugMode, setDebugMode] = useState(false);
  const debugActions = {
    isDebug: debugMode,
    toggleDebug: () => setDebugMode(prev => !prev),
    addScore,
    triggerBonus: () => {
        setKaguraActive(true);
        playSound('vapo');
        setTimeout(() => setKaguraActive(false), 2000);
    },
    setGameOver: () => {
        setGameState('GAME_OVER');
        playSound('gameOver');
        clearTimer();
    },
    setTimer: (s: number) => setTimeLeft(s),
    winLevel: () => {
        if (gameState === 'IDLE' || gameState === 'GAME_OVER') return;
        addScore(10);
        setLevel(prev => prev + 1);
        setIsInputLocked(true);
        setTimeout(() => {
            addToSequence();
            setGameState('PLAYING_SEQUENCE');
            playSequence();
        }, 500);
    }
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
