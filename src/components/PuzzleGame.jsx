import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import ListenButton from './ListenButton';
import { playPop, playSuccess, speakHebrew } from '../utils/audio';
import { ALL_OBJECTS, getRandomItems } from '../utils/content';
import './PuzzleGame.css';

const PUZZLE_SIZES = [3, 4, 5, 6];

export default function PuzzleGame({ onWin }) {
  const [size] = useState(() => PUZZLE_SIZES[Math.floor(Math.random() * PUZZLE_SIZES.length)]);
  
  // Select random objects to be the puzzle pieces
  const puzzleItems = useMemo(() => {
    return getRandomItems(ALL_OBJECTS, size);
  }, [size]);

  // Shuffle for the tray
  const trayItems = useMemo(() => {
    return [...puzzleItems].sort(() => 0.5 - Math.random());
  }, [puzzleItems]);

  const [placedItems, setPlacedItems] = useState([]);
  const [won, setWon] = useState(false);

  const handleDragEnd = (event, info, item) => {
    // Look at what elements are under the drop point
    const dropTargets = document.elementsFromPoint(info.point.x, info.point.y);
    const targetEl = dropTargets.find(el => el.getAttribute('data-slot'));
    
    if (targetEl) {
      const slotId = targetEl.getAttribute('data-slot');
      if (slotId === item.id) {
        playPop();
        setPlacedItems(prev => {
          const newPlaced = [...prev, item.id];
          if (newPlaced.length === puzzleItems.length) {
            setWon(true);
            playSuccess();
            if (onWin) setTimeout(onWin, 3000);
          }
          return newPlaced;
        });
      }
    }
  };

  if (won) {
    return (
      <div className="success-screen">
        <CheckCircle2 size={120} color="#86efac" />
        <h1>כל הכבוד!</h1>
        <div style={{ fontSize: '4rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {puzzleItems.map(item => (
            <span key={item.id}>{item.icon}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="puzzle-game glass-panel">
      <div className="header-row" style={{ marginBottom: '1rem' }}>
        <ListenButton text="גררי את התמונה אל הצללית המתאימה" />
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>התאמת צלליות</h2>
      </div>

      <div className="puzzle-layout shadow-mode">
        {/* The Board (Shadows) */}
        <div className="shadow-board">
          {puzzleItems.map((item) => {
            const isPlaced = placedItems.includes(item.id);
            return (
              <div 
                key={`slot-${item.id}`} 
                className="shadow-slot"
                data-slot={item.id}
              >
                {isPlaced ? (
                  <div className="placed-emoji">{item.icon}</div>
                ) : (
                  <div className="shadow-emoji">{item.icon}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* The Tray (Colored Pieces) */}
        <div className="shadow-tray">
          {trayItems.map(item => {
            if (placedItems.includes(item.id)) {
              // Reserve space so the tray layout doesn't jump around
              return <div key={`empty-${item.id}`} className="tray-placeholder" />;
            }
            
            return (
              <motion.div
                key={`drag-${item.id}`}
                className="draggable-emoji"
                drag
                dragSnapToOrigin
                onDragStart={() => speakHebrew(item.name || item.id)}
                onDragEnd={(e, info) => handleDragEnd(e, info, item)}
                whileDrag={{ scale: 1.3, zIndex: 100 }}
              >
                {item.icon}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
