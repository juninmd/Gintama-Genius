import { useState, useCallback, useEffect, useRef } from 'react';
import type { Difficulty, TimeMode, GameState } from '../../constants';
import { generateEntropy } from '../../utils/math';
import { MESSAGES_SUCCESS } from '../../constants';
import type { Feedback } from '../useGameLogic';
import { MESSAGES_HARDCORE, pickMessage, executeKaguraBonus, checkSpeedBonus } from './useGameEngineHelpers';

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
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  errorCountRef?: React.MutableRefObject<number>
) => {
  const [level, setLevel] = useState(0);
  const [kaguraActive, setKaguraActive] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const kaguraCountRef = useRef(0);
  const lastInputTimeRef = useRef(0);
  // The next round starts 1.5 s after a completed sequence; quitting or a time-out in that window must cancel it.
  const nextRoundRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameStateRef = useRef(gameState);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const cancelNextRound = useCallback(() => {
    if (nextRoundRef.current) clearTimeout(nextRoundRef.current);
    nextRoundRef.current = null;
  }, []);

  const showFeedback = useCallback((nextFeedback: Feedback, durationMs = 0) => {
    setFeedback(nextFeedback);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    if (durationMs > 0) feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), durationMs);
  }, []);

  const startGame = useCallback((difficulty: Difficulty, timeMode: TimeMode) => {
    cancelNextRound();
    resetScore();
    resetSequence();
    setSettings({ difficulty, timeMode });

    setLevel(0);
    setKaguraActive(false);
    kaguraCountRef.current = 0;
    lastInputTimeRef.current = 0;
    setFeedback(null);

    if (errorCountRef) errorCountRef.current = 0;

    playSound('novo');
    addToSequence();

    setGameState('COUNTDOWN');
    startCountdown(3);
  }, [cancelNextRound, resetScore, resetSequence, setSettings, startCountdown, addToSequence, playSound, setGameState, errorCountRef]);

  const handleColorClick = useCallback((color: number) => {
     if (gameState !== 'WAITING_FOR_INPUT') return;

     playSound(color);

     const result = validateInput(color);

     if (result === 'wrong') {
        lastInputTimeRef.current = 0;
        if (errorCountRef) errorCountRef.current += 1;

        setGameState('GAME_OVER');
        playSound('gameOver');
        clearTimer();

        if (settings.difficulty === 'HARDCORE') {
           showFeedback({ message: 'YATO KING VENCEU!', type: 'error' });
        } else if (streak > 5) {
            showFeedback({ message: 'COMBO QUEBRADO!', type: 'error' });
        } else {
            showFeedback({ message: 'VOCÊ ERROU!', type: 'error' });
        }

        resetStreak();
        return;
     }

     addScore(1);

     if (result === 'complete' || result === 'correct') {
         lastInputTimeRef.current = checkSpeedBonus(Date.now(), lastInputTimeRef.current, showFeedback, addScore);
     }

     const newStreak = incrementStreak();
     executeKaguraBonus(settings.difficulty, settings.timeMode, kaguraCountRef, setTimeLeft, addScore, playSound, setKaguraActive);

     if (result === 'complete') {
        lastInputTimeRef.current = 0;
        setIsInputLocked(true);
        setLevel(prev => prev + 1);

        // One message per completion: a second showFeedback would replace the streak milestone in the same tick.
        if (newStreak % 5 === 0) showFeedback({ message: 'SEQUÊNCIA DE ACERTOS!', type: 'combo' }, 2000);
        else if (settings.difficulty === 'HARDCORE') showFeedback({ message: pickMessage(MESSAGES_HARDCORE), type: 'success' }, 1000);
        else if (settings.difficulty === 'BERSERK' && generateEntropy() < 0.5) showFeedback({ message: 'INCRÍVEL!', type: 'success' }, 1500);
        else showFeedback({ message: generateEntropy() < 0.6 ? 'VOCÊ ACERTOU!' : pickMessage(MESSAGES_SUCCESS), type: 'success' }, 1500);

        cancelNextRound();
        nextRoundRef.current = setTimeout(() => {
             nextRoundRef.current = null;
             if (gameStateRef.current === 'GAME_OVER' || gameStateRef.current === 'IDLE') return;
             addToSequence();
             setGameState('PLAYING_SEQUENCE');
             playSequence();
        }, 1500);
     } else if (result === 'correct') {
         showFeedback({ message: pickMessage(['BOA!', 'ISSO!', 'BEM!', 'VAI!']), type: 'success' }, 400);
     }
  }, [
    gameState, validateInput, playSound, clearTimer, streak,
    resetStreak, showFeedback, addScore, incrementStreak,
    setIsInputLocked, addToSequence, playSequence, cancelNextRound,
    settings.difficulty, settings.timeMode, setTimeLeft, setKaguraActive, setGameState, errorCountRef
  ]);

  const resetGame = useCallback(() => {
    cancelNextRound();
    setGameState('IDLE');
    resetScore();
    resetSequence();
    clearTimer();
    setFeedback(null);
    setKaguraActive(false);
    if (errorCountRef) errorCountRef.current = 0;
  }, [cancelNextRound, resetScore, resetSequence, clearTimer, setGameState, errorCountRef]);

  return {
    level, setLevel, kaguraActive, setKaguraActive,
    feedback, showFeedback, startGame, handleColorClick, resetGame
  };
};
