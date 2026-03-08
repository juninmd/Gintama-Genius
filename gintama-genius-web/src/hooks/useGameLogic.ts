import { useState, useCallback, useEffect, useRef } from 'react';
import { useAudio } from './game/useAudio';
import { useGameScore } from './game/useGameScore';
import { useGameTimer } from './game/useGameTimer';
import { useGameSequence } from './game/useGameSequence';
import { useDebugActions } from './game/useDebugActions';
import { useGameEngine } from './game/useGameEngine';
import {
  type Difficulty,
  type TimeMode,
  type GameState
} from '../constants';

export interface Feedback {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'combo';
}

export const useGameLogic = () => {
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

  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [settings, setSettings] = useState<{ difficulty: Difficulty; timeMode: TimeMode }>({
    difficulty: 'NORMAL',
    timeMode: '60s',
  });

  const gameStateRef = useRef<GameState>('IDLE');

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const onTimeUp = useCallback(() => {
    if (gameStateRef.current !== 'IDLE' && gameStateRef.current !== 'GAME_OVER') {
        setGameState('GAME_OVER');
        playSound('gameOver');
        // showFeedback logic has been moved to useGameEngine. We can just rely on the engine's feedback state to be updated, or not show feedback directly here since it's Game Over.
        setIsInputLocked(true);
    }
  }, [playSound, setIsInputLocked]);

  const {
    timeLeft,
    countdownValue,
    startTimer,
    resetTimer,
    clearTimer,
    startCountdown,
    setTimeLeft
  } = useGameTimer(settings.timeMode, onTimeUp);

  const {
    level,
    setLevel,
    kaguraActive,
    setKaguraActive,
    feedback,
    showFeedback,
    startGame,
    handleColorClick,
    resetGame
  } = useGameEngine(
    playSound, resetScore, addScore, incrementStreak, resetStreak, streak,
    resetSequence, addToSequence, playSequence, validateInput, setIsInputLocked,
    clearTimer, startCountdown, setTimeLeft,
    settings, setSettings, gameState, setGameState
  );

  const debugActions = useDebugActions({
    gameState, addScore, setKaguraActive, playSound, setGameState, clearTimer,
    setTimeLeft, setLevel, setIsInputLocked, addToSequence, playSequence
  });

  useEffect(() => {
    if (gameState === 'IDLE') resetTimer();
  }, [settings.timeMode, resetTimer, gameState]);

  useEffect(() => {
    if (gameState === 'PLAYING_SEQUENCE' && !isInputLocked && sequence.length > 0 && playbackIndex === -1) {
      const timer = setTimeout(() => setGameState('WAITING_FOR_INPUT'), 0);
      return () => clearTimeout(timer);
    }
  }, [gameState, isInputLocked, sequence.length, playbackIndex]);

  useEffect(() => {
    if (gameState === 'COUNTDOWN' && countdownValue === 0) {
      const timer = setTimeout(() => {
        setGameState('PLAYING_SEQUENCE');
        showFeedback({ message: 'NOVA RODADA!', type: 'info' }, 1500);
        startTimer();
        playSequence();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState, countdownValue, startTimer, playSequence, showFeedback]);

  return {
    gameState, score, level, timeLeft, activeColor, sequence, userInputIndex,
    settings, kaguraActive, streak, highScore, feedback, countdownValue, isMuted,
    toggleMute, startGame, handleColorClick, resetGame, debugActions,
  };
};
