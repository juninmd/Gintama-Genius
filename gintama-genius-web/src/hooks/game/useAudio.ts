import { useState, useCallback, useEffect } from 'react';
import { audioController } from '../../utils/audio';

export const useAudio = () => {
  const [isMuted, setIsMuted] = useState(audioController.muted);

  useEffect(() => {
    const unlockAudio = () => audioController.resume();
    const events = ['click', 'touchstart', 'pointerdown'];

    events.forEach(event => window.addEventListener(event, unlockAudio, { once: true }));

    return () => {
      events.forEach(event => window.removeEventListener(event, unlockAudio));
    };
  }, []);

  const toggleMute = useCallback(() => {
    const newState = audioController.toggleMute();
    setIsMuted(newState);
  }, []);

  const playSound = useCallback((key: string | number) => {
    audioController.play(key);
  }, []);

  return { isMuted, toggleMute, playSound };
};
