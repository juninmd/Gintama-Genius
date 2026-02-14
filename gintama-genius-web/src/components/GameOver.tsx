import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, highScore, onRestart }) => {
  const [displayScore, setDisplayScore] = useState(0);

  // Rank Calculation
  const getRank = (s: number) => {
    if (s <= 5) return { title: "Madao", color: "#6c757d", desc: "Um samurai sem óculos..." };
    if (s <= 15) return { title: "Shinpachi", color: "#00BFFF", desc: "95% Óculos, 5% Humano" };
    if (s <= 30) return { title: "Samurai", color: "#28a745", desc: "Alma de Prata" };
    if (s <= 50) return { title: "Yorozuya", color: "#ffb703", desc: "Faz tudo por dinheiro!" };
    if (s <= 80) return { title: "Shiroyasha", color: "#dc3545", desc: "O Demônio Branco!" };
    return { title: "Yato King", color: "#6f2dbd", desc: "Instinto Assassino!" };
  };

  const rank = getRank(score);
  const isNewRecord = score >= highScore && score > 0;

  // Score Counting Animation
  useEffect(() => {
    let start = 0;
    const end = score;
    if (start === end) return;

    const timer = setInterval(() => {
        start += 1;
        setDisplayScore(start);
        if (start === end) clearInterval(timer);
    }, Math.max(20, 1000 / (end + 1)));

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="game-over-overlay" style={{
        backgroundImage: 'url(/assets/images/gameover.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    }}>
      <motion.div
        className="game-over-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <h1>Fim de Jogo</h1>

        <div style={{ marginBottom: '1.5rem' }}>
             <motion.div
                style={{ fontSize: '4rem', fontWeight: 900, color: '#023047', fontFamily: "'Space Grotesk', sans-serif" }}
             >
                {displayScore}
             </motion.div>
             <div style={{ fontSize: '1.2rem', color: '#666' }}>PONTOS</div>
        </div>

        {isNewRecord && (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ delay: 0.5 }}
                style={{
                    background: '#ffb703',
                    color: '#023047',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    marginBottom: '1rem',
                    border: '3px solid #023047',
                    boxShadow: '4px 4px 0 rgba(0,0,0,0.2)'
                }}
            >
                NOVO RECORDE!
            </motion.div>
        )}

        <div className="rank-container" style={{ margin: '1rem 0', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.9rem', color: '#6c757d', textTransform: 'uppercase' }}>Rank Atual</div>
            <motion.div
                style={{ color: rank.color, fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif" }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {rank.title}
            </motion.div>
            <div style={{ fontStyle: 'italic', color: '#495057' }}>"{rank.desc}"</div>
        </div>

        <div style={{ marginBottom: '2rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
            Melhor Pontuação: <span style={{ color: '#d00000' }}>{Math.max(score, highScore)}</span>
        </div>

        <motion.button
            onClick={onRestart}
            className="restart-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            Jogar Novamente
        </motion.button>
      </motion.div>
    </div>
  );
};

export default GameOver;
