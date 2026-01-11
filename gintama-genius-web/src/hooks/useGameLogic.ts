import { useState, useEffect, useRef, useCallback } from 'react';

export type GameState = 'IDLE' | 'PLAYING_SEQUENCE' | 'WAITING_FOR_INPUT' | 'GAME_OVER';

export type Difficulty = 'BERSERK' | 'NORMAL' | 'EASY';
export type TimeMode = '30s' | '60s' | '120s' | '240s' | 'INFINITE';

export const COLORS = [1, 2, 3, 4] as const; // Red, Green, Blue, Yellow

interface UseGameLogicReturn {
  gameState: GameState;
  score: number;
  level: number;
  timeLeft: number;
  activeColor: number | null; // The color currently lit up
  sequence: number[];
  userInputIndex: number;
  settings: {
    difficulty: Difficulty;
    timeMode: TimeMode;
  };
  kaguraActive: boolean;
  startGame: (difficulty: Difficulty, timeMode: TimeMode) => void;
  handleColorClick: (color: number) => void;
  resetGame: () => void;
}

const SOUNDS = {
  1: '/assets/sounds/vermelho.wav',
  2: '/assets/sounds/verde.wav',
  3: '/assets/sounds/vermelho.wav', // Blue uses Red sound (pitch shifted later)
  4: '/assets/sounds/verde.wav',    // Yellow uses Green sound (pitch shifted later)
  gameOver: '/assets/sounds/fimdejogo.wav',
  vapo: '/assets/sounds/uow.wav',
  novo: '/assets/sounds/novo.wav',
};

// Playback rates for distinct sounds
const PLAYBACK_RATES: { [key: string]: number } = {
  1: 1.0, // Red
  2: 1.0, // Green
  3: 0.8, // Blue (Lower pitch Red)
  4: 1.5, // Yellow (Higher pitch Green)
};

export const useGameLogic = (): UseGameLogicReturn => {
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
  const [, setKaguraCount] = useState(0);
  const [kaguraActive, setKaguraActive] = useState(false);

  // Audio refs
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    // Preload sounds
    Object.entries(SOUNDS).forEach(([key, src]) => {
      const audio = new Audio(src);
      audioRefs.current[key] = audio;
    });
  }, []);

  const playSound = useCallback((key: string | number) => {
    const audio = audioRefs.current[key];
    if (audio) {
      audio.currentTime = 0;

      // Apply pitch shift if defined
      if (PLAYBACK_RATES[key]) {
        audio.playbackRate = PLAYBACK_RATES[key];
        // For browsers that require it for pitch preservation (optional, but good for "chipmunk" effect)
        // @ts-ignore
        if (audio.preservesPitch !== undefined) {
             // @ts-ignore
             audio.preservesPitch = false;
        }
      } else {
        audio.playbackRate = 1.0;
      }

      audio.play().catch(e => console.error("Error playing sound", e));
    }
  }, []);

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

  const startGame = (difficulty: Difficulty, timeMode: TimeMode) => {
    setSettings({ difficulty, timeMode });
    setGameState('PLAYING_SEQUENCE');
    setScore(0);
    setLevel(0);
    setSequence([]);
    setUserInputIndex(0);
    setKaguraCount(0);
    setKaguraActive(false);
    setTimeLeft(getInitialTime(timeMode));

    playSound('novo');
    addToSequence();
  };

  const addToSequence = () => {
    const nextColor = Math.floor(Math.random() * 4) + 1;
    setSequence(prev => [...prev, nextColor]);
  };

  // Timer Effect
  useEffect(() => {
    let timer: any;
    if (gameState !== 'IDLE' && gameState !== 'GAME_OVER' && settings.timeMode !== 'INFINITE') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('GAME_OVER');
            playSound('gameOver');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, settings.timeMode]);

  // Sequence Playback Effect
  useEffect(() => {
    if (gameState === 'PLAYING_SEQUENCE' && sequence.length > 0) {
      let i = 0;
      const interval = setInterval(() => {
        if (i >= sequence.length) {
          clearInterval(interval);
          setActiveColor(null);
          setGameState('WAITING_FOR_INPUT');
          setUserInputIndex(0);
          return;
        }

        const color = sequence[i];
        setActiveColor(color);
        playSound(color);

        setTimeout(() => {
          setActiveColor(null);
        }, 500); // Light up duration

        i++;
      }, 800); // Time between sequence items

      return () => clearInterval(interval);
    }
  }, [gameState, sequence, playSound]);

  const handleColorClick = (color: number) => {
    if (gameState !== 'WAITING_FOR_INPUT') return;

    playSound(color);

    // Check correctness
    if (color === sequence[userInputIndex]) {
      // Correct
      const nextIndex = userInputIndex + 1;
      setUserInputIndex(nextIndex);

      if (nextIndex === sequence.length) {
        // Completed sequence
        setScore(prev => prev + 1);
        setLevel(prev => prev + 1);

        // Kagura Bonus Check logic
        setKaguraCount(prev => {
          const newCount = prev + 1;
          if (newCount === 30 && settings.difficulty !== 'BERSERK') {
             // Bonus Trigger
             setTimeLeft(t => (settings.timeMode === 'INFINITE' ? t : t + 30));
             setScore(s => s + 10);
             playSound('vapo');
             setKaguraActive(true);
             setTimeout(() => setKaguraActive(false), 2000);
             return 0;
          }
          return newCount;
        });

        setTimeout(() => {
          setGameState('PLAYING_SEQUENCE');
          addToSequence();
        }, 1000);
      } else {
         // Correct input, incomplete sequence
         setScore(prev => prev + 1);
         setKaguraCount(prev => {
           const newCount = prev + 1;
           if (newCount === 30 && settings.difficulty !== 'BERSERK') {
             // Bonus Trigger
             setTimeLeft(t => (settings.timeMode === 'INFINITE' ? t : t + 30));
             setScore(s => s + 10);
             playSound('vapo');
             setKaguraActive(true);
             setTimeout(() => setKaguraActive(false), 2000);
             return 0;
           }
           return newCount;
         });
      }

    } else {
      // Wrong
      setGameState('GAME_OVER');
      playSound('gameOver');
    }
  };

  const resetGame = () => {
    setGameState('IDLE');
    setScore(0);
    setLevel(0);
    setSequence([]);
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
    startGame,
    handleColorClick,
    resetGame,
  };
};
