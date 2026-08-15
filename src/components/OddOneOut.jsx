import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import ListenButton from './ListenButton';
import { playPop, playSuccess, speakHebrew, playAnimalSound } from '../utils/audio';
import { ALL_OBJECTS, getRandomItems } from '../utils/content';
import './OddOneOut.css';

export default function OddOneOut({ onWin }) {
  const [won, setWon] = useState(false);
  const [shouldSpeak, setShouldSpeak] = useState(true);

  // Generate grid of 6 items (5 same, 1 different)
  const { items, outlierId } = useMemo(() => {
    const picked = getRandomItems(ALL_OBJECTS, 2);
    const majority = picked[0];
    const outlier = picked[1];

    let grid = [outlier];
    for (let i = 0; i < 5; i++) {
      grid.push(majority);
    }
    
    // Shuffle
    grid = grid.sort(() => 0.5 - Math.random());
    
    // Assign unique IDs for rendering
    const renderedItems = grid.map((item, idx) => ({ ...item, uniqueId: `${item.id}-${idx}` }));

    return { items: renderedItems, outlierId: outlier.id };
  }, []);

  useEffect(() => {
    if (shouldSpeak && 'speechSynthesis' in window) {
      setTimeout(() => {
        speakHebrew("מצאי את השונה");
      }, 500);
      setShouldSpeak(false);
    }
  }, [shouldSpeak]);

  const handleTap = (item) => {
    speakHebrew(item.name || item.id);
    if (item.type === 'animal') playAnimalSound(item.id);
    
    if (item.id === outlierId) {
      playSuccess();
      setWon(true);
      if (onWin) setTimeout(onWin, 3000);
    } else {
      playPop();
    }
  };

  if (won) {
    return (
      <div className="success-screen">
        <CheckCircle2 size={120} color="#86efac" />
        <h1>כל הכבוד!</h1>
      </div>
    );
  }

  return (
    <div className="odd-one-out glass-panel">
      <div className="header-row">
        <ListenButton text="מצאי את השונה" />
        <h2>מצאי את השונה</h2>
      </div>

      <div className="odd-grid">
        {items.map(item => (
          <motion.div
            key={item.uniqueId}
            className="odd-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTap(item)}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleTap(item);
            }}
          >
            <span className="big-emoji">{item.icon}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
