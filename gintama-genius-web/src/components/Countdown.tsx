import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
  value: number;
}

const Countdown: React.FC<CountdownProps> = ({ value }) => {
  return (
    <div className="countdown-overlay" style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 500,
        pointerEvents: 'none',
        background: 'rgba(0,0,0,0.3)', // Slight dim
        backdropFilter: 'blur(2px)'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
            key={value}
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1.5, rotate: 0 }}
            exit={{ opacity: 0, scale: 2, filter: 'blur(10px)' }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
                fontSize: 'min(150px, 25vw)',
                fontWeight: '900',
                color: '#ffb703',
                textShadow: '6px 6px 0 #023047, 0 0 20px rgba(255,183,3,0.5)',
                fontFamily: "'Space Grotesk', sans-serif",
                zIndex: 501,
                whiteSpace: 'nowrap'
            }}
        >
            {value > 0 ? value : "JÁ!"}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Countdown;
