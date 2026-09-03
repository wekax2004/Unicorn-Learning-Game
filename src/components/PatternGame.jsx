import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ListenButton from './ListenButton';
import { playPop, playSuccess } from '../utils/audio';
import { ALL_OBJECTS, getRandomItems } from '../utils/content';
import './PatternGame.css';

export default function PatternGame({ onWin }) {
  const [round, setRound] = useState(0);
  const [won, setWon] = useState(false);
  const [shakeId, setShakeId] = useState(null);
  
  const { sequence, target, options } = useMemo(() => {
    // Generate ABAB pattern: A, B, A, B, A, ? -> Target is B
    const picked = getRandomItems(ALL_OBJECTS, 2);
    const A = picked[0];
    const B = picked[1];
    const seq = [A, B, A, B, A];
    
    // Target is B
    const otherOptions = getRandomItems(ALL_OBJECTS.filter(o => o.id !== B.id), 2);
    const opts = getRandomItems([B, ...otherOptions], 3);
    
    return { sequence: seq, target: B, options: opts };
  }, [round]);

  const handleTap = (opt) => {
    if (opt.id === target.id) {
      playPop();
      if (round < 2) {
        setRound(r => r + 1);
      } else {
        playSuccess();
        setWon(true);
        if (onWin) setTimeout(onWin, 2500);
      }
    } else {
      setShakeId(opt.id);
      setTimeout(() => setShakeId(null), 500);
    }
  };

  if (won) {
    return (
      <div className="success-screen">
        <div className="unicorn-success">🦄</div>
        <h1>כל הכבוד!</h1>
      </div>
    );
  }

  return (
    <div className="pattern-game glass-panel">
      <div className="header-row">
        <ListenButton text="מה בא אחרי?" />
        <h2>מה בא אחרי?</h2>
      </div>
      
      <div className="pattern-display">
        {sequence.map((item, i) => (
          <span key={i} className="pattern-item">{item.icon}</span>
        ))}
        <span className="pattern-item question-mark">❓</span>
      </div>

      <div className="options-row">
        {options.map(opt => (
          <motion.div
            key={opt.id}
            className={`pattern-option ${shakeId === opt.id ? 'shake' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTap(opt)}
          >
            {opt.icon}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
