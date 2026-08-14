import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import ListenButton from './ListenButton';
import { playPop, playSuccess } from '../utils/audio';
import './PuzzleGame.css';

const DIFFICULTIES = [
  { id: 'easy', label: '4 חלקים', cols: 2, rows: 2 },
  { id: 'medium', label: '9 חלקים', cols: 3, rows: 3 },
  { id: 'hard', label: '16 חלקים', cols: 4, rows: 4 },
  { id: 'expert', label: '30 חלקים', cols: 6, rows: 5 }
];

const ANIMAL_PHOTOS = [
  'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&q=80&w=600&h=500', // Cat
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600&h=500', // Dog
  'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=600&h=500', // Bunny
  'https://images.unsplash.com/photo-1550258859-d088c27e2a9d?auto=format&fit=crop&q=80&w=600&h=500', // Pig
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=600&h=500', // Puppy
  'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&q=80&w=600&h=500', // Leopard
  'https://images.unsplash.com/photo-1504006833117-8886a355efbf?auto=format&fit=crop&q=80&w=600&h=500', // Fox
  'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&q=80&w=600&h=500'  // Panda
];

export default function PuzzleGame({ onWin }) {
  const [difficulty, setDifficulty] = useState(null);
  const [placedPieces, setPlacedPieces] = useState([]);
  const [won, setWon] = useState(false);

  // Choose a random real animal photo
  const imageSrc = useMemo(() => {
    return ANIMAL_PHOTOS[Math.floor(Math.random() * ANIMAL_PHOTOS.length)];
  }, []);

  // Generate pieces based on selected difficulty
  const pieces = useMemo(() => {
    if (!difficulty) return [];
    
    const piecesArray = [];
    const width = 100 / difficulty.cols;
    const height = 100 / difficulty.rows;
    
    for (let r = 0; r < difficulty.rows; r++) {
      for (let c = 0; c < difficulty.cols; c++) {
        piecesArray.push({
          id: `${r}-${c}`,
          r,
          c,
          // Hebrew is RTL, so column 0 is rendered on the right. 
          // We must invert the X axis so the rightmost piece shows the right side of the image!
          bgX: ((difficulty.cols - 1 - c) / (difficulty.cols - 1)) * 100 || 0,
          bgY: (r / (difficulty.rows - 1)) * 100 || 0,
          width,
          height
        });
      }
    }
    
    // Shuffle pieces for the tray
    return piecesArray.sort(() => 0.5 - Math.random());
  }, [difficulty]);

  const handleDragEnd = (event, info, piece) => {
    const dropTargets = document.elementsFromPoint(info.point.x, info.point.y);
    const targetEl = dropTargets.find(el => el.getAttribute('data-slot'));
    
    if (targetEl) {
      const slotId = targetEl.getAttribute('data-slot');
      if (slotId === piece.id) {
        playPop();
        setPlacedPieces(prev => {
          const newPlaced = [...prev, piece.id];
          if (newPlaced.length === pieces.length) {
            setWon(true);
            playSuccess();
            if (onWin) setTimeout(onWin, 3000);
          }
          return newPlaced;
        });
      }
    }
  };

  if (!difficulty) {
    return (
      <div className="puzzle-game glass-panel">
        <div className="header-row">
          <ListenButton text="בחרי רמת קושי לפאזל" />
          <h2>בחרי רמה</h2>
        </div>
        <div className="difficulty-grid">
          {DIFFICULTIES.map(diff => (
            <button 
              key={diff.id} 
              className="diff-btn"
              onClick={() => setDifficulty(diff)}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (won) {
    return (
      <div className="success-screen">
        <CheckCircle2 size={120} color="#86efac" />
        <h1>כל הכבוד! הפאזל הושלם!</h1>
        <img src={imageSrc} alt="Completed Puzzle" className="completed-puzzle-img" />
      </div>
    );
  }

  return (
    <div className="puzzle-game glass-panel">
      <div className="header-row" style={{ marginBottom: '1rem' }}>
        <ListenButton text="גררי את החלקים למקום הנכון להשלמת התמונה" />
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>השלימי את הפאזל</h2>
      </div>

      <div className="puzzle-layout">
        {/* The Board */}
        <div 
          className="puzzle-board-advanced"
          style={{
            gridTemplateColumns: `repeat(${difficulty.cols}, 1fr)`,
            gridTemplateRows: `repeat(${difficulty.rows}, 1fr)`
          }}
        >
          {Array.from({ length: difficulty.rows }).map((_, r) => (
            Array.from({ length: difficulty.cols }).map((_, c) => {
              const slotId = `${r}-${c}`;
              const isPlaced = placedPieces.includes(slotId);
              const piece = pieces.find(p => p.id === slotId);
              
              return (
                <div 
                  key={`slot-${slotId}`} 
                  className="puzzle-slot"
                  data-slot={slotId}
                >
                  {isPlaced && piece && (
                    <div 
                      className="placed-piece"
                      style={{
                        backgroundImage: `url(${imageSrc})`,
                        backgroundPosition: `${piece.bgX}% ${piece.bgY}%`,
                        backgroundSize: `${difficulty.cols * 100}% ${difficulty.rows * 100}%`
                      }}
                    />
                  )}
                </div>
              );
            })
          ))}
        </div>

        {/* The Tray */}
        <div className="puzzle-tray">
          {pieces.map(piece => {
            if (placedPieces.includes(piece.id)) return null;
            
            return (
              <motion.div
                key={`drag-${piece.id}`}
                className="draggable-piece"
                drag
                dragSnapToOrigin
                onDragEnd={(e, info) => handleDragEnd(e, info, piece)}
                whileDrag={{ scale: 1.2, zIndex: 100 }}
                style={{
                  backgroundImage: `url(${imageSrc})`,
                  backgroundPosition: `${piece.bgX}% ${piece.bgY}%`,
                  backgroundSize: `${difficulty.cols * 100}% ${difficulty.rows * 100}%`,
                  // Fixed size for the tray items so they are draggable
                  width: '60px',
                  height: '50px'
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
