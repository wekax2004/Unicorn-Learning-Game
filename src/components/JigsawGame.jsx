import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import ListenButton from './ListenButton';
import { playPop, playSuccess } from '../utils/audio';
import './JigsawGame.css';

const DIFFICULTIES = [
  { id: 'easy', label: '4 חלקים', cols: 2, rows: 2 },
  { id: 'medium', label: '9 חלקים', cols: 3, rows: 3 },
  { id: 'hard', label: '16 חלקים', cols: 4, rows: 4 }
];

const PUZZLE_IMAGES = [
  'https://images.unsplash.com/photo-1587691592099-2404574cea50?auto=format&fit=crop&w=600&q=80', // Hot air balloons
  'https://images.unsplash.com/photo-1551846743-41c09935bd64?auto=format&fit=crop&w=600&q=80', // Macarons
  'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80', // Toy blocks
  'https://images.unsplash.com/photo-1629814545300-aee8ebbb79fa?auto=format&fit=crop&w=600&q=80', // Crayons
];

function generatePuzzlePieces(cols, rows) {
  const pieces = [];
  
  // hEdges[r][c] is the edge between piece (r, c) and piece (r, c+1)
  const hEdges = []; 
  for(let r=0; r<rows; r++) {
    const rowEdges = [];
    for(let c=0; c<cols-1; c++) {
      rowEdges.push(Math.random() > 0.5 ? 1 : -1);
    }
    hEdges.push(rowEdges);
  }
  
  // vEdges[r][c] is the edge between piece (r, c) and piece (r+1, c)
  const vEdges = [];
  for(let r=0; r<rows-1; r++) {
    const rowEdges = [];
    for(let c=0; c<cols; c++) {
      rowEdges.push(Math.random() > 0.5 ? 1 : -1);
    }
    vEdges.push(rowEdges);
  }

  for(let r=0; r<rows; r++) {
    for(let c=0; c<cols; c++) {
      let d = `M 0 0 `;
      
      // Top edge
      if (r === 0) {
        d += `H 100 `;
      } else {
        const sign = vEdges[r-1][c] === 1 ? -1 : 1;
        d += `C 30 0, 30 ${sign*25}, 50 ${sign*25} `;
        d += `C 70 ${sign*25}, 70 0, 100 0 `;
      }
      
      // Right edge
      if (c === cols - 1) {
        d += `V 100 `;
      } else {
        const sign = hEdges[r][c];
        d += `C 100 30, ${100 + sign*25} 30, ${100 + sign*25} 50 `;
        d += `C ${100 + sign*25} 70, 100 70, 100 100 `;
      }
      
      // Bottom edge
      if (r === rows - 1) {
        d += `H 0 `;
      } else {
        const sign = vEdges[r][c];
        d += `C 70 100, 70 ${100 + sign*25}, 50 ${100 + sign*25} `;
        d += `C 30 ${100 + sign*25}, 30 100, 0 100 `;
      }
      
      // Left edge
      if (c === 0) {
        d += `V 0 `;
      } else {
        const sign = hEdges[r][c-1] === 1 ? -1 : 1;
        d += `C 0 70, ${sign*25} 70, ${sign*25} 50 `;
        d += `C ${sign*25} 30, 0 30, 0 0 `;
      }
      
      d += 'Z';
      pieces.push({ id: `${r}-${c}`, r, c, path: d });
    }
  }
  
  return pieces.sort(() => 0.5 - Math.random());
}

export default function JigsawGame({ onWin }) {
  const [difficulty] = useState(() => DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)]);
  const [placedPieces, setPlacedPieces] = useState([]);
  const [won, setWon] = useState(false);

  // Choose a random clear photo
  const imageSrc = useMemo(() => {
    return PUZZLE_IMAGES[Math.floor(Math.random() * PUZZLE_IMAGES.length)];
  }, []);

  // Generate real interlocking puzzle pieces
  const pieces = useMemo(() => {
    if (!difficulty) return [];
    return generatePuzzlePieces(difficulty.cols, difficulty.rows);
  }, [difficulty]);

  const handleDragEnd = (event, info, piece) => {
    const dropTargets = document.elementsFromPoint(info.point.x, info.point.y);
    const targetEl = dropTargets.find(el => el && el.getAttribute && el.getAttribute('data-jigsaw-slot'));
    
    if (targetEl) {
      const slotId = targetEl.getAttribute('data-jigsaw-slot');
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

  if (won) {
    return (
      <div className="success-screen">
        <CheckCircle2 size={120} color="#86efac" />
        <h1>כל הכבוד! הפאזל הושלם!</h1>
        <div className="completed-jigsaw" style={{ backgroundImage: `url(${imageSrc})` }} />
      </div>
    );
  }

  return (
    <div className="jigsaw-game glass-panel">
      <div className="header-row" style={{ marginBottom: '1rem' }}>
        <ListenButton text="הרכיבי את התמונה מחדש" />
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>פאזל תמונה</h2>
      </div>

      <div className="jigsaw-layout">
        <div 
          className="jigsaw-board"
          style={{
            direction: 'ltr', // Force LTR so piece math aligns perfectly
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
                  className="jigsaw-slot"
                  data-jigsaw-slot={slotId}
                >
                  {isPlaced && piece && (
                    <div className="jigsaw-placed-piece">
                      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        <clipPath id={`clip-${slotId}`}>
                          <path d={piece.path} />
                        </clipPath>
                        <image 
                          href={imageSrc} 
                          width={`${difficulty.cols * 100}`} 
                          height={`${difficulty.rows * 100}`} 
                          x={`${-piece.c * 100}`} 
                          y={`${-piece.r * 100}`} 
                          clipPath={`url(#clip-${slotId})`} 
                          preserveAspectRatio="xMidYMid slice"
                        />
                        <path d={piece.path} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })
          ))}
        </div>

        <div className="jigsaw-tray">
          {pieces.map(piece => {
            if (placedPieces.includes(piece.id)) {
              return <div key={`empty-${piece.id}`} className="jigsaw-tray-placeholder" />;
            }
            
            return (
              <motion.div
                key={`drag-${piece.id}`}
                className="jigsaw-draggable"
                drag
                dragSnapToOrigin
                onDragEnd={(e, info) => handleDragEnd(e, info, piece)}
                whileDrag={{ scale: 1.3, zIndex: 100 }}
              >
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <clipPath id={`clip-tray-${piece.id}`}>
                    <path d={piece.path} />
                  </clipPath>
                  <image 
                    href={imageSrc} 
                    width={`${difficulty.cols * 100}`} 
                    height={`${difficulty.rows * 100}`} 
                    x={`${-piece.c * 100}`} 
                    y={`${-piece.r * 100}`} 
                    clipPath={`url(#clip-tray-${piece.id})`} 
                    preserveAspectRatio="xMidYMid slice"
                  />
                  <path d={piece.path} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="3" strokeLinejoin="round" />
                </svg>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
