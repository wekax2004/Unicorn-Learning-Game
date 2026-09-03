import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ListenButton from './ListenButton';
import { playPop, playSuccess } from '../utils/audio';
import { FRUITS_VEGGIES, ANIMALS, getRandomItems } from '../utils/content';
import './OrderingGame.css';

export default function OrderingGame({ onWin }) {
  const [expectedIndex, setExpectedIndex] = useState(0); // 0 to 3
  const [won, setWon] = useState(false);
  const [shakeId, setShakeId] = useState(null);

  const { item, sizes } = useMemo(() => {
    const allItems = [...FRUITS_VEGGIES, ...ANIMALS];
    const picked = allItems[Math.floor(Math.random() * allItems.length)];
    
    // scales: smallest to largest (0 is smallest, 3 is largest)
    const sizeData = [
      { id: 's0', scale: 0.5, order: 0 },
      { id: 's1', scale: 0.75, order: 1 },
      { id: 's2', scale: 1.1, order: 2 },
      { id: 's3', scale: 1.5, order: 3 }
    ];
    
    return { 
      item: picked, 
      sizes: getRandomItems(sizeData, 4) // shuffled visually
    };
  }, []);

  const handleTap = (sizeItem) => {
    if (sizeItem.order === expectedIndex) {
      playPop();
      if (expectedIndex === 3) {
        setExpectedIndex(4);
        playSuccess();
        setWon(true);
        if (onWin) setTimeout(onWin, 2500);
      } else {
        setExpectedIndex(r => r + 1);
      }
    } else if (sizeItem.order > expectedIndex) {
      // Wrong one
      setShakeId(sizeItem.id);
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
    <div className="ordering-game glass-panel">
      <div className="header-row">
        <ListenButton text="סדרי מהקטן לגדול" />
        <h2>סדרי מהקטן לגדול</h2>
      </div>

      <div className="ordering-grid">
        {sizes.map((s) => {
          const isCorrect = s.order < expectedIndex;
          return (
            <motion.div
              key={s.id}
              className={`order-item-container ${shakeId === s.id ? 'shake' : ''} ${isCorrect ? 'correct' : ''}`}
              onClick={() => !isCorrect && handleTap(s)}
              whileHover={!isCorrect ? { scale: 1.05 } : {}}
              whileTap={!isCorrect ? { scale: 0.95 } : {}}
            >
              <div 
                className="order-item" 
                style={{ transform: `scale(${s.scale})`, opacity: isCorrect ? 0.5 : 1 }}
              >
                {item.icon}
              </div>
              {isCorrect && <div className="check-mark">✅</div>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
