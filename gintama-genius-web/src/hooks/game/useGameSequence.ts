import { useState, useCallback, useRef, useEffect } from 'react';

type PlaySoundFn = (key: string | number) => void;

export const useGameSequence = (playSound: PlaySoundFn) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInputIndex, setUserInputIndex] = useState(0);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [playbackIndex, setPlaybackIndex] = useState(-1);
  const [isInputLocked, setIsInputLocked] = useState(false);

  // Using refs for internal timeout management to avoid closure staleness issues
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearScheduledTimeouts = useCallback(() => {
    timeoutRefs.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutRefs.current = [];
  }, []);

  const resetSequence = useCallback(() => {
    setSequence([]);
    setUserInputIndex(0);
    setActiveColor(null);
    setPlaybackIndex(-1);
    setIsInputLocked(true); // Lock input by default until game starts
    clearScheduledTimeouts();
  }, [clearScheduledTimeouts]);

  const addToSequence = useCallback(() => {
    const nextColor = Math.floor(Math.random() * 4) + 1;
    setSequence((prev) => [...prev, nextColor]);
    setPlaybackIndex(-1); // Reset playback index but don't start yet
  }, []);

  const playSequence = useCallback(() => {
    setIsInputLocked(true);
    setPlaybackIndex(0);
  }, []);

  // Playback Effect
  useEffect(() => {
    if (playbackIndex === -1) return;

    if (playbackIndex >= sequence.length) {
      // Finished playback
       const timer = setTimeout(() => {
          setIsInputLocked(false);
          setUserInputIndex(0);
          setActiveColor(null);
          setPlaybackIndex(-1); // Reset to -1 to stop this effect from running again
       }, 500);
       return () => clearTimeout(timer);
    }

    const color = sequence[playbackIndex];
    let isMounted = true;

    // We need to manage timeouts manually here to ensure clean cleanup
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
      clearTimeout(lightUpTimeout);
      clearTimeout(clearLightTimeout);
      clearTimeout(nextStepTimeout);
    };
  }, [playbackIndex, sequence, playSound]);

  // Clean up
  useEffect(() => {
    return () => clearScheduledTimeouts();
  }, [clearScheduledTimeouts]);

  const validateInput = useCallback((color: number): 'correct' | 'wrong' | 'complete' | 'locked' => {
    if (isInputLocked) return 'locked';

    const expectedColor = sequence[userInputIndex];
    if (expectedColor === undefined) return 'wrong';

    if (color !== expectedColor) {
      setIsInputLocked(true);
      return 'wrong';
    }

    const nextIndex = userInputIndex + 1;
    setUserInputIndex(nextIndex);

    if (nextIndex === sequence.length) {
      setIsInputLocked(true);
      return 'complete';
    }

    return 'correct';
  }, [isInputLocked, sequence, userInputIndex]);

  return {
    sequence,
    userInputIndex,
    activeColor,
    isInputLocked,
    playbackIndex,
    addToSequence,
    resetSequence,
    playSequence,
    validateInput,
    setIsInputLocked,
    setSequence // Exposed for debug/testing
  };
};
