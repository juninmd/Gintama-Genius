import React from 'react';
import { motion } from 'framer-motion';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['1', 'R'], action: 'Vermelho (cima)' },
    { keys: ['2', 'G'], action: 'Verde (esquerda)' },
    { keys: ['3', 'B'], action: 'Azul (direita)' },
    { keys: ['4', 'Y'], action: 'Amarelo (baixo)' },
    { keys: ['↑', '←', '→', '↓'], action: 'Setas direcionais' },
    { keys: ['ESC'], action: 'Pausar / Fechar' },
    { keys: ['M'], action: 'Alternar som' },
    { keys: ['H'], action: 'Mostrar ajuda' },
  ];

  return (
    <motion.div
      className="shortcuts-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="shortcuts-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
      >
        <h2>Atalhos do Teclado</h2>
        <div className="shortcuts-list">
          {shortcuts.map(({ keys, action }) => (
            <div key={action} className="shortcut-item">
              <div className="shortcut-keys">
                {keys.map(k => (
                  <kbd key={k} className="key">{k}</kbd>
                ))}
              </div>
              <span className="shortcut-action">{action}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="shortcuts-close">Fechar (ESC)</button>
      </motion.div>
    </motion.div>
  );
};
