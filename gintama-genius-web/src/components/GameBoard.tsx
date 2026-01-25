import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { COLORS } from '../hooks/useGameLogic';

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

const colorHexMap: { [key: string]: string } = {
  vermelho: '#ef233c',
  verde: '#38b000',
  azul: '#4361ee',
  amarelo: '#ffcc00',
};

const GameBoard: React.FC<GameBoardProps> = ({ activeColor, onColorClick, disabled }) => {
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

    const addPopup = () => {
        const id = Date.now() + Math.random();
        const texts = ["+1", "Boa!", "Isso!", "Acertou!", "Aí sim!", "Yorozuya!"];
        const text = texts[Math.floor(Math.random() * texts.length)];
        setPopups(prev => [...prev, {id, text}]);
        setTimeout(() => {
             setPopups(prev => prev.filter(p => p.id !== id));
        }, 800);
    };

    const triggerConfetti = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                particleCount: 15,
                spread: 40,
                origin: { x, y },
                colors: [colorHexMap[colorName]],
                disableForReducedMotion: true,
                startVelocity: 15,
                gravity: 2,
                scalar: 0.6,
                ticks: 50
            });
        }
    };

    const handleMouseDown = () => {
        if (!disabled) {
            setIsPressed(true);
            triggerConfetti();
            addPopup();
            onClick();
        }
    };

    const handleMouseUp = () => {
        setIsPressed(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!disabled) {
            e.preventDefault(); // Prevent ghost clicks
            setIsPressed(true);
            triggerConfetti();
            addPopup();
            onClick();
        }
    }

    const showActive = isActive || isPressed;
    const imgSrc = showActive
        ? `/assets/images/${colorName}_on.png`
        : `/assets/images/${colorName}.png`;

    return (
        <motion.button
            ref={buttonRef}
            className={`game-btn btn-${colorName} ${showActive ? 'active' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleMouseUp}
            style={{
                backgroundImage: `url(${imgSrc})`,
                cursor: disabled ? 'default' : 'pointer',
                // Explicitly set background size again to be safe with motion override quirks
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
            animate={{
                scale: showActive ? 1.05 : 1,
                filter: showActive ? 'brightness(1.3)' : 'brightness(1)'
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <AnimatePresence>
                {popups.map(p => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 1, y: -40, scale: 1.2 }}
                        exit={{ opacity: 0, y: -60, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#fff',
                            fontWeight: '900',
                            fontSize: '1.5rem',
                            textShadow: '2px 2px 0 #000, 0 0 10px rgba(0,0,0,0.5)',
                            pointerEvents: 'none',
                            zIndex: 20,
                            whiteSpace: 'nowrap',
                            fontFamily: "'Mochiy Pop P One', cursive"
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
