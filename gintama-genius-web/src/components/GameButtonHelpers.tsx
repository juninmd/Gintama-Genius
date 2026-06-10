import React from 'react';
import { Flame, Droplets, Zap, Leaf } from 'lucide-react';
import confetti from 'canvas-confetti';
import { COLOR_HEX_MAP } from '../constants';

/**
 * Gets the icon component based on the color name.
 * @param colorName The name of the color.
 */
export const getButtonIcon = (colorName: string) => {
    const props = { size: 48, color: 'rgba(0,0,0,0.5)', style: { filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' } };

    switch (colorName) {
        case 'vermelho': return <Flame {...props} />;
        case 'verde': return <Leaf {...props} />;
        case 'azul': return <Droplets {...props} />;
        case 'amarelo': return <Zap {...props} />;
        default: return null;
    }
};

/**
 * Triggers localized confetti for a button click.
 * @param buttonRef Reference to the button HTML element.
 * @param colorName The name of the color.
 */
export const triggerButtonConfetti = (buttonRef: React.RefObject<HTMLButtonElement | null>, colorName: string) => {
    if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 24,
            spread: 70,
            origin: { x, y },
            colors: [COLOR_HEX_MAP[colorName]],
            disableForReducedMotion: true,
            startVelocity: 16,
            gravity: 1.5,
            scalar: 0.7,
            ticks: 42,
            shapes: ['circle', 'square']
        });
    }
};
