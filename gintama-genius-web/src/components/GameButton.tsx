import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Droplets, Zap, Leaf } from 'lucide-react';
import confetti from 'canvas-confetti';
import { COLOR_HEX_MAP } from '../constants';

interface GameButtonProps {
    color: number;
    colorName: string;
    isActive: boolean;
    onClick: () => void;
    disabled: boolean;
}

export const GameButton: React.FC<GameButtonProps> = ({ colorName, isActive, onClick, disabled }) => {
    const [isPressed, setIsPressed] = useState(false);
    const [popups, setPopups] = useState<{id: number, text: string}[]>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const popupTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const shouldReduceMotion = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    useEffect(() => {
      return () => {
        popupTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
        popupTimeoutsRef.current = [];
      };
    }, []);

    const getIcon = () => {
        const props = { size: 48, color: 'rgba(0,0,0,0.5)', style: { filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' } };

        switch (colorName) {
            case 'vermelho': return <Flame {...props} />;
            case 'verde': return <Leaf {...props} />;
            case 'azul': return <Droplets {...props} />;
            case 'amarelo': return <Zap {...props} />;
            default: return null;
        }
    };

    const addPopup = () => {
        const id = Date.now() + Math.random();
        const texts = ["+1", "BOA!", "INCRÍVEL!", "ISSO!", "COMBO!", "PERFEITO", "GENIAL!", "MITOU!"];
        const text = texts[Math.floor(Math.random() * texts.length)];
        setPopups(prev => [...prev, {id, text}]);
        const timeoutId = setTimeout(() => {
            setPopups(prev => prev.filter(p => p.id !== id));
            popupTimeoutsRef.current = popupTimeoutsRef.current.filter((t) => t !== timeoutId);
        }, 800);
        popupTimeoutsRef.current.push(timeoutId);
    };

    const triggerConfetti = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                particleCount: 12,
                spread: 50,
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

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!disabled) {
            e.preventDefault();
            setIsPressed(true);
            if (!shouldReduceMotion && Math.random() < 0.35) {
              triggerConfetti();
            }
            if (!shouldReduceMotion && Math.random() < 0.6) {
              addPopup();
            }
            onClick();
        }
    };

    const handlePointerUp = () => {
        setIsPressed(false);
    };

    const showActive = isActive || isPressed;

    return (
        <motion.button
            ref={buttonRef}
            className={`game-btn btn-${colorName} ${showActive ? 'active' : ''}`}
            aria-label={`Botão ${colorName}`}
            disabled={disabled}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{
                cursor: disabled ? 'default' : 'pointer',
                touchAction: 'manipulation'
            }}
            animate={{
                scale: showActive ? 0.98 : 1,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
            }}>
                {getIcon()}
            </div>

            <AnimatePresence>
                {popups.map(p => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 1, y: -50, scale: 1.5 }}
                        exit={{ opacity: 0, y: -80, scale: 0.5 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#fff',
                            fontWeight: '900',
                            fontSize: '1.5rem',
                            textShadow: `0 0 10px ${COLOR_HEX_MAP[colorName]}, 0 0 20px ${COLOR_HEX_MAP[colorName]}`,
                            pointerEvents: 'none',
                            zIndex: 20,
                            whiteSpace: 'nowrap',
                            fontFamily: "'Space Grotesk', sans-serif"
                        }}
                    >
                        {p.text}
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.button>
    );
};
