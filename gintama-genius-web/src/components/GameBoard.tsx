import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Droplets, Zap, Leaf } from 'lucide-react';
import confetti from 'canvas-confetti';
import { COLORS } from '../constants';

interface GameBoardProps {
  activeColor: number | null;
  onColorClick: (color: number) => void;
  disabled: boolean;
}

const colorMap: { [key: number]: string } = {
  1: 'vermelho',
  2: 'verde',
  3: 'azul',
  4: 'amarelo',
};

// Updated to Neon Palette
const colorHexMap: { [key: string]: string } = {
  vermelho: '#ff0055',
  verde: '#00ff00',
  azul: '#00f3ff',
  amarelo: '#f9f871',
};

const KEY_TO_COLOR: Record<string, number> = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  r: 1,
  g: 2,
  b: 3,
  y: 4,
  arrowup: 1,
  arrowleft: 2,
  arrowright: 3,
  arrowdown: 4,
};

const GameBoard: React.FC<GameBoardProps> = ({ activeColor, onColorClick, disabled }) => {
  useEffect(() => {
    if (disabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

      const mappedColor = KEY_TO_COLOR[event.key.toLowerCase()];
      if (!mappedColor) return;

      event.preventDefault();
      onColorClick(mappedColor);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [disabled, onColorClick]);

  return (
    <div className="game-board">
      <div className="simon-circle">
        <motion.div
            className="center-circle"
            animate={{ rotate: activeColor ? 360 : 0 }}
            transition={{ duration: 0.5 }}
        >
            <img src="/assets/images/genius.ico" alt="Logo" className="center-logo" />
        </motion.div>
        {COLORS.map((color) => {
          const colorName = colorMap[color];
          const isActive = activeColor === color;

          return (
             <GameButton
                key={color}
                color={color}
                colorName={colorName}
                isActive={isActive}
                onClick={() => !disabled && onColorClick(color)}
                disabled={disabled}
             />
          );
        })}
      </div>
    </div>
  );
};

const GameButton: React.FC<{
    color: number,
    colorName: string,
    isActive: boolean,
    onClick: () => void,
    disabled: boolean
}> = ({ colorName, isActive, onClick, disabled }) => {
    const [isPressed, setIsPressed] = React.useState(false);
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
        // In neon theme, icons should perhaps be dark on bright buttons

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
        const texts = ["+1", "NEON!", "CYBER!", "HIT!", "GOOD!", "COMBO!", "PERFECT"];
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
                colors: [colorHexMap[colorName]],
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
                            textShadow: `0 0 10px ${colorHexMap[colorName]}, 0 0 20px ${colorHexMap[colorName]}`,
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
}

export default GameBoard;
