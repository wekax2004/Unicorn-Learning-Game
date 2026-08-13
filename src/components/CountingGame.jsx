import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import ListenButton from './ListenButton';
import { playPop, playSuccess } from '../utils/audio';
import { ANIMALS, getRandomItems } from '../utils/content';
import './CountingGame.css';

export default function CountingGame({ onWin }) {
  const [won, setWon] = useState(false);
  
  const { animal, count, options } = useMemo(() => {
    const pickedAnimal = getRandomItems(ANIMALS, 1)[0];
    const pickedCount = Math.floor(Math.random() * 5) + 1; // 1 to 5 for now
    
    // Generate 3 options including the correct one
    let opts = [pickedCount];
    while (opts.length < 3) {
      const r = Math.floor(Math.random() * 5) + 1;
      if (!opts.includes(r)) opts.push(r);
    }
    opts = opts.sort(() => 0.5 - Math.random());
    
    return { animal: pickedAnimal, count: pickedCount, options: opts };
  }, []);

  const handleDragEnd = (e, info, option) => {
    const dropTargets = document.elementsFromPoint(info.point.x, info.point.y);
    const targetEl = dropTargets.find(el => el.getAttribute('data-target') === 'drop-zone');
    
    if (targetEl && option === count) {
      playSuccess();
      setWon(true);
      if (onWin) setTimeout(onWin, 2500);
    } else if (targetEl) {
      // wrong answer, maybe small shake or boop sound
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
    <div className="counting-game glass-panel">
      <div className="header-row">
        <ListenButton text={`כמה ${animal.name}ים יש כאן?`} />
        <h2>כמה יש כאן?</h2>
      </div>

      <div className="objects-container">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div 
            key={`obj-${i}`} 
            className="animal-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            {animal.icon}
          </motion.div>
        ))}
      </div>

      <div className="interaction-area">
        <div className="drop-zone" data-target="drop-zone">
          <span className="placeholder-text">גררי לכאן</span>
        </div>
        
        <div className="numbers-container">
          {options.map((opt) => (
            <motion.div
              key={`num-${opt}`}
              className="draggable-number"
              drag
              dragSnapToOrigin
              onDragEnd={(e, info) => handleDragEnd(e, info, opt)}
              whileDrag={{ scale: 1.2, zIndex: 100 }}
            >
              {opt}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
