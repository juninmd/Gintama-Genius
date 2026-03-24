import { useState, useCallback, useRef } from 'react';
import type { Difficulty, TimeMode, GameState } from '../../constants';
import { generateEntropy } from '../../utils/math';
import { MESSAGES_SUCCESS } from '../../constants';
import type { Feedback } from '../useGameLogic';

export const useGameEngine = (
  playSound: (key: number | string) => void,
  resetScore: () => void,
  addScore: (score: number) => void,
  incrementStreak: () => number,
  resetStreak: () => void,
  streak: number,
  resetSequence: () => void,
  addToSequence: () => void,
  playSequence: () => void,
  validateInput: (color: number) => 'wrong' | 'complete' | 'correct' | 'locked',
  setIsInputLocked: (locked: boolean) => void,
  clearTimer: () => void,
  startCountdown: (val: number) => void,
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>,
  settings: { difficulty: Difficulty; timeMode: TimeMode },
  setSettings: React.Dispatch<React.SetStateAction<{ difficulty: Difficulty; timeMode: TimeMode }>>,
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
  const [level, setLevel] = useState(0);
  const [kaguraActive, setKaguraActive] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const kaguraCountRef = useRef(0);

  const pickMessage = (arr: string[]) => arr[Math.floor(generateEntropy() * arr.length)]; // nosonar

  const showFeedback = useCallback((nextFeedback: Feedback, durationMs = 0) => {
    setFeedback(nextFeedback);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);

    if (durationMs > 0) {
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback(null);
      }, durationMs);
    }
  }, []);

  const triggerKaguraBonus = useCallback(() => {
    if (settings.difficulty === 'BERSERK') return;

    kaguraCountRef.current += 1;
    if (kaguraCountRef.current < 15) return;

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
    setSettings({ difficulty, timeMode });

    setLevel(0);
    setKaguraActive(false);
    kaguraCountRef.current = 0;
    setFeedback(null);

    playSound('novo');
    addToSequence();

    setGameState('COUNTDOWN');
    startCountdown(3);
  }, [resetScore, resetSequence, setSettings, startCountdown, addToSequence, playSound, setGameState]);

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
            showFeedback({ message: 'VOCÊ ERROU!', type: 'error' });
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
            showFeedback({ message: 'SEQUÊNCIA DE ACERTOS!', type: 'combo' }, 2000);
        } else {
             // To explicitly meet user requirements, always show a success feedback that includes the phrase "VOCÊ ACERTOU!" often.
             const msg = generateEntropy() < 0.6 ? 'VOCÊ ACERTOU!' : pickMessage(MESSAGES_SUCCESS); // nosonar
             showFeedback({ message: msg, type: 'success' }, 1500);
        }

        if (settings.difficulty === 'BERSERK' && generateEntropy() < 0.5) { // nosonar
           showFeedback({ message: 'INCRÍVEL!', type: 'success' }, 1500);
        }

        setTimeout(() => {
             addToSequence();
             setGameState('PLAYING_SEQUENCE');
             playSequence();
        }, 1500);
     }
  }, [
    gameState, validateInput, playSound, clearTimer, streak,
    resetStreak, showFeedback, addScore, incrementStreak,
    triggerKaguraBonus, setIsInputLocked, addToSequence, playSequence, settings.difficulty, setGameState
  ]);

  const resetGame = useCallback(() => {
    setGameState('IDLE');
    resetScore();
    resetSequence();
    clearTimer();
    setFeedback(null);
    setKaguraActive(false);
  }, [resetScore, resetSequence, clearTimer, setGameState]);

  return {
    level, setLevel, kaguraActive, setKaguraActive, feedback, showFeedback,
    startGame, handleColorClick, resetGame
  };
};
