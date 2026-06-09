import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Feedback } from '../../../hooks/useGameLogic';

export const useConfettiEffect = (feedback: Feedback | null, isCombo: boolean) => {
  useEffect(() => {
    if (!feedback) return;

    if (feedback.type === 'info') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.4 },
        colors: ['#00f3ff', '#ff0055', '#f9f871'],
        disableForReducedMotion: true
      });
    }

    if (isCombo) {
      const duration = 1500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff0055', '#f9f871']
        });
        confetti({
          particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#00f3ff', '#bc13fe']
        });

        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [feedback, isCombo]);
};
