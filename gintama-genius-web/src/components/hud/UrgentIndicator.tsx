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
        <motion.div
          className="urgent-indicator"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: [1, 1.1, 1] }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          style={{
            color: '#ff0055',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textShadow: '0 0 10px #ff0055',
            padding: '0.5rem 1rem',
            background: 'rgba(50, 0, 0, 0.8)',
            borderRadius: '8px',
            border: '2px solid #ff0055',
            boxShadow: '0 0 20px #ff0055'
          }}
        >
          <AlertTriangle size={32} />
          <span>CORRA!</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
