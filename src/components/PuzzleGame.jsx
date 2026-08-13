import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import ListenButton from './ListenButton';
import { playPop, playSuccess } from '../utils/audio';
import { ANIMALS, getRandomItems } from '../utils/content';
import './PuzzleGame.css';

export default function PuzzleGame({ onWin }) {
  const [won, setWon] = useState(false);
  
  const { animal, missingQuadrant, options } = useMemo(() => {
    const pickedAnimal = getRandomItems(ANIMALS, 1)[0];
    const quadrant = Math.floor(Math.random() * 4); // 0,1,2,3 for TopLeft, TopRight, BottomLeft, BottomRight
    
    const allAnimals = getRandomItems(ANIMALS, 3);
    if (!allAnimals.find(a => a.id === pickedAnimal.id)) {
      allAnimals[0] = pickedAnimal;
    }
    const shuffledOptions = allAnimals.sort(() => 0.5 - Math.random());
    
    return { animal: pickedAnimal, missingQuadrant: quadrant, options: shuffledOptions };
  }, []);

  const getClipPath = (q) => {
    switch(q) {
      case 0: return 'polygon(0 0, 50% 0, 50% 50%, 0 50%)'; // TL
      case 1: return 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)'; // TR
      case 2: return 'polygon(0 50%, 50% 50%, 50% 100%, 0 100%)'; // BL
      case 3: return 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)'; // BR
      default: return 'none';
    }
  };

  const handleDragEnd = (event, info, opt) => {
    const dropTargets = document.elementsFromPoint(info.point.x, info.point.y);
    const targetEl = dropTargets.find(el => el.getAttribute('data-puzzle-hole'));
    
    if (targetEl && opt.id === animal.id) {
      playSuccess();
      setWon(true);
      if (onWin) setTimeout(onWin, 2500);
    } else if (targetEl) {
      playPop(); // incorrect boop
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
    <div className="puzzle-game glass-panel">
      <div className="header-row">
        <ListenButton text="השלימי את התמונה החסרה" />
        <h2>השלימי את התמונה</h2>
      </div>

      <div className="puzzle-board">
        <div className="puzzle-image">
          <span className="big-emoji">{animal.icon}</span>
        </div>
        
        {/* The hole over the missing quadrant */}
        <div 
          className="puzzle-hole" 
          data-puzzle-hole="true"
          style={{ clipPath: getClipPath(missingQuadrant) }}
        >
          <div className="hole-inner">?</div>
        </div>
      </div>

      <div className="puzzle-pieces">
        {options.map((opt) => (
          <motion.div
            key={`piece-${opt.id}`}
            className="puzzle-piece"
            drag
            dragSnapToOrigin
            onDragEnd={(e, info) => handleDragEnd(e, info, opt)}
            whileDrag={{ scale: 1.2, zIndex: 100 }}
          >
            <div className="piece-content" style={{ clipPath: getClipPath(missingQuadrant) }}>
              <span className="big-emoji" style={{ transform: 'scale(0.5)' }}>{opt.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
