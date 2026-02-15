import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface UrgentIndicatorProps {
  visible: boolean;
}

export const UrgentIndicator: React.FC<UrgentIndicatorProps> = ({ visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <>
            {/* Vignette Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'radial-gradient(circle, transparent 40%, rgba(255, 0, 0, 0.4) 90%)',
                    pointerEvents: 'none',
                    zIndex: 5
                }}
            />

            {/* Pulsing Border Effect on Screen */}
            <motion.div
                animate={{ boxShadow: ['inset 0 0 0px #ff0000', 'inset 0 0 50px #ff0000', 'inset 0 0 0px #ff0000'] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    pointerEvents: 'none',
                    zIndex: 6
                }}
            />

            {/* Floating Warning */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50, x: '-50%' }}
              animate={{
                opacity: 1,
                scale: [1, 1.1, 1],
                y: 0,
                x: '-50%'
              }}
              exit={{ opacity: 0, scale: 0.8, y: 50, x: '-50%' }}
              transition={{
                scale: { repeat: Infinity, duration: 0.6 },
                opacity: { duration: 0.2 }
              }}
              style={{
                position: 'fixed',
                bottom: '18%',
                left: '50%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#ff0055',
                fontSize: '1.8rem',
                fontWeight: '900',
                textShadow: '0 0 20px #ff0055',
                padding: '0.8rem 1.5rem',
                background: 'rgba(20, 0, 0, 0.9)',
                borderRadius: '50px',
                border: '2px solid #ff0055',
                boxShadow: '0 0 30px rgba(255, 0, 85, 0.5)',
                zIndex: 100,
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(4px)'
              }}
            >
              <AlertTriangle size={36} strokeWidth={3} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CORRA!</span>
            </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
