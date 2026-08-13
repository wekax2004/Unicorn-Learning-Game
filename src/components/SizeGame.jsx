import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ListenButton from './ListenButton';
import { playPop, playSuccess } from '../utils/audio';
import { FRUITS_VEGGIES, ANIMALS } from '../utils/content';
import './SizeGame.css';

export default function SizeGame({ onWin }) {
  const [placed, setPlaced] = useState({ big: false, small: false });
  const [won, setWon] = useState(false);

  const { item, startPos } = useMemo(() => {
    const allItems = [...FRUITS_VEGGIES, ...ANIMALS];
    const picked = allItems[Math.floor(Math.random() * allItems.length)];
    // Randomize whether big is on left or right initially
    const isBigLeft = Math.random() > 0.5;
    return { 
      item: picked, 
      startPos: isBigLeft ? ['big', 'small'] : ['small', 'big'] 
    };
  }, []);

  const handleDragEnd = (event, info, type) => {
    const dropTargets = document.elementsFromPoint(info.point.x, info.point.y);
    const targetEl = dropTargets.find(el => el.getAttribute('data-basket'));
    
    if (targetEl) {
      const basketType = targetEl.getAttribute('data-basket');
      if (basketType === type) {
        playPop();
        setPlaced(prev => {
          const newPlaced = { ...prev, [type]: true };
          if (newPlaced.big && newPlaced.small) {
            setWon(true);
            playSuccess();
            if (onWin) setTimeout(onWin, 2500);
          }
          return newPlaced;
        });
      } else {
        // Incorrect basket
        playPop(); // Could use a different boop sound here if we had one
      }
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
    <div className="size-game glass-panel">
      <div className="header-row">
        <ListenButton text="התאימי את הגדול לסל הגדול, והקטן לסל הקטן" />
        <h2>גדול וקטן</h2>
      </div>

      <div className="baskets-container">
        <div className="basket-area" data-basket="big">
          <div className="basket big-basket">🧺</div>
          <div className="basket-label">גדול</div>
        </div>
        
        <div className="basket-area" data-basket="small">
          <div className="basket small-basket">🧺</div>
          <div className="basket-label">קטן</div>
        </div>
      </div>

      <div className="items-container">
        {startPos.map((type) => {
          if (placed[type]) return <div key={type} className="placeholder" />;
          
          return (
            <motion.div
              key={type}
              className={`draggable-item ${type}-item`}
              drag
              dragSnapToOrigin
              onDragEnd={(e, info) => handleDragEnd(e, info, type)}
              whileDrag={{ scale: 1.1, zIndex: 100 }}
            >
              {item.icon}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
