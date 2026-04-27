import { useState, useCallback, useEffect, useRef } from 'react';
import { useAudio } from './game/useAudio';
import { useGameScore } from './game/useGameScore';
import { useGameTimer } from './game/useGameTimer';
import { useGameSequence } from './game/useGameSequence';
import { useDebugActions } from './game/useDebugActions';
import { useGameEngine } from './game/useGameEngine';
import { useScoreHistory } from './useScoreHistory';
import { useAchievements } from './useAchievements';
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

  const { addEntry } = useScoreHistory();
  const { recentlyUnlocked, checkAndUnlock: checkAchievements } = useAchievements();

  const gameStateRef = useRef<GameState>('IDLE');
  const errorCountRef = useRef(0);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const onTimeUp = useCallback(() => {
    if (gameStateRef.current !== 'IDLE' && gameStateRef.current !== 'GAME_OVER' && gameStateRef.current !== 'PAUSED') {
        setGameState('GAME_OVER');
        playSound('gameOver');
        setIsInputLocked(true);
        checkAchievements({ score, streak, level: 0, isHardcore: settings.difficulty === 'HARDCORE', errors: errorCountRef.current });
        addEntry({ score, difficulty: settings.difficulty, timeMode: settings.timeMode, level: 0 });
    }
  }, [playSound, setIsInputLocked, score, streak, settings, addEntry, checkAchievements]);

  const {
    timeLeft,
    countdownValue,
    startTimer,
    resetTimer,
    clearTimer,
    startCountdown,
    setTimeLeft,
    pauseTimer,
    resumeTimer
  } = useGameTimer(settings.timeMode, onTimeUp);

  const togglePause = useCallback(() => {
    if (gameState === 'WAITING_FOR_INPUT') {
      setGameState('PAUSED');
      pauseTimer();
      setIsInputLocked(true);
    } else if (gameState === 'PAUSED') {
      setGameState('WAITING_FOR_INPUT');
      resumeTimer();
      setIsInputLocked(false);
    }
  }, [gameState, pauseTimer, resumeTimer, setIsInputLocked]);

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
    settings, setSettings, gameState, setGameState, errorCountRef
  );

  const debugActions = useDebugActions({
    gameState, addScore, setKaguraActive, playSound, setGameState, clearTimer,
    setTimeLeft, setLevel, setIsInputLocked, addToSequence, playSequence
  });

  useEffect(() => {
    if (gameState === 'IDLE') {
      resetTimer();
      errorCountRef.current = 0;
    }
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

  const handleGameOver = useCallback((finalScore: number, finalLevel: number) => {
    checkAchievements({
      score: finalScore,
      streak: streak,
      level: finalLevel,
      isHardcore: settings.difficulty === 'HARDCORE',
      errors: errorCountRef.current
    });
    addEntry({
      score: finalScore,
      difficulty: settings.difficulty,
      timeMode: settings.timeMode,
      level: finalLevel
    });
  }, [checkAchievements, addEntry, streak, settings]);

  return {
    gameState, score, level, timeLeft, activeColor, sequence, userInputIndex,
    settings, kaguraActive, streak, highScore, feedback, countdownValue, isMuted,
    toggleMute, startGame, handleColorClick, resetGame, debugActions,
    togglePause, recentlyUnlocked, handleGameOver,
  };
};
