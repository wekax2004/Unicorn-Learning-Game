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

const SCENES = [
  {
    id: 'unicorn',
    bg: ['#fbcfe8', '#bae6fd'],
    elements: [
      { char: '🦄', x: 20, y: 30, size: 80 },
      { char: '🌈', x: 70, y: 20, size: 70 },
      { char: '🏰', x: 40, y: 60, size: 90 },
      { char: '🦋', x: 85, y: 75, size: 50 },
      { char: '🌸', x: 15, y: 85, size: 40 }
    ]
  },
  {
    id: 'farm',
    bg: ['#86efac', '#fef08a'],
    elements: [
      { char: '🐮', x: 30, y: 40, size: 80 },
      { char: '🚜', x: 70, y: 65, size: 70 },
      { char: '🐔', x: 20, y: 75, size: 50 },
      { char: '☀️', x: 80, y: 15, size: 60 },
      { char: '🌳', x: 50, y: 25, size: 80 }
    ]
  },
  {
    id: 'ocean',
    bg: ['#93c5fd', '#3b82f6'],
    elements: [
      { char: '🐬', x: 30, y: 35, size: 80 },
      { char: '🐙', x: 75, y: 65, size: 70 },
      { char: '🐟', x: 15, y: 75, size: 50 },
      { char: '🐠', x: 50, y: 20, size: 45 },
      { char: '🦀', x: 40, y: 85, size: 40 }
    ]
  },
  {
    id: 'space',
    bg: ['#1e1b4b', '#4c1d95'],
    elements: [
      { char: '🚀', x: 35, y: 45, size: 80 },
      { char: '🌎', x: 75, y: 25, size: 70 },
      { char: '⭐', x: 15, y: 20, size: 40 },
      { char: '⭐', x: 50, y: 80, size: 30 },
      { char: '👽', x: 80, y: 80, size: 60 }
    ]
  }
];

function generatePuzzlePieces(cols, rows) {
  const pieces = [];
  
  const hEdges = []; 
  for(let r=0; r<rows; r++) {
    const rowEdges = [];
    for(let c=0; c<cols-1; c++) {
      rowEdges.push(Math.random() > 0.5 ? 1 : -1);
    }
    hEdges.push(rowEdges);
  }
  
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
      let ox = c * 100;
      let oy = r * 100;
      let d = `M ${ox} ${oy} `;
      
      if (r === 0) {
        d += `H ${ox + 100} `;
      } else {
        const sign = vEdges[r-1][c] === 1 ? -1 : 1;
        d += `C ${ox+30} ${oy}, ${ox+30} ${oy+sign*25}, ${ox+50} ${oy+sign*25} `;
        d += `C ${ox+70} ${oy+sign*25}, ${ox+70} ${oy}, ${ox+100} ${oy} `;
      }
      
      if (c === cols - 1) {
        d += `V ${oy + 100} `;
      } else {
        const sign = hEdges[r][c];
        d += `C ${ox+100} ${oy+30}, ${ox+100 + sign*25} ${oy+30}, ${ox+100 + sign*25} ${oy+50} `;
        d += `C ${ox+100 + sign*25} ${oy+70}, ${ox+100} ${oy+70}, ${ox+100} ${oy+100} `;
      }
      
      if (r === rows - 1) {
        d += `H ${ox} `;
      } else {
        const sign = vEdges[r][c];
        d += `C ${ox+70} ${oy+100}, ${ox+70} ${oy+100 + sign*25}, ${ox+50} ${oy+100 + sign*25} `;
        d += `C ${ox+30} ${oy+100 + sign*25}, ${ox+30} ${oy+100}, ${ox} ${oy+100} `;
      }
      
      if (c === 0) {
        d += `V ${oy} `;
      } else {
        const sign = hEdges[r][c-1] === 1 ? -1 : 1;
        d += `C ${ox} ${oy+70}, ${ox+sign*25} ${oy+70}, ${ox+sign*25} ${oy+50} `;
        d += `C ${ox+sign*25} ${oy+30}, ${ox} ${oy+30}, ${ox} ${oy} `;
      }
      
      d += 'Z';
      pieces.push({ id: `${r}-${c}`, r, c, path: d });
    }
  }
  
  return pieces.sort(() => 0.5 - Math.random());
}

// Render the completed picture
function SceneSVG({ scene, width, height }) {
  return (
    <svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${scene.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={scene.bg[0]} />
          <stop offset="100%" stopColor={scene.bg[1]} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#grad-${scene.id})`} />
      {scene.elements.map((el, idx) => (
        <text 
          key={idx} 
          x={el.x} 
          y={el.y} 
          fontSize={el.size / 2} 
          textAnchor="middle" 
          dominantBaseline="middle"
        >
          {el.char}
        </text>
      ))}
    </svg>
  );
}

export default function JigsawGame({ onWin }) {
  const [difficulty] = useState(() => DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)]);
  const [placedPieces, setPlacedPieces] = useState([]);
  const [won, setWon] = useState(false);

  const scene = useMemo(() => SCENES[Math.floor(Math.random() * SCENES.length)], []);

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

  const totalW = difficulty.cols * 100;
  const totalH = difficulty.rows * 100;

  if (won) {
    return (
      <div className="success-screen">
        <CheckCircle2 size={120} color="#86efac" />
        <h1>כל הכבוד! הפאזל הושלם!</h1>
        <div className="completed-jigsaw" style={{ position: 'relative', width: '300px', height: '300px', borderRadius: '20px', overflow: 'hidden' }}>
          <SceneSVG scene={scene} width="100%" height="100%" />
        </div>
      </div>
    );
  }

  // Define the common pattern once so we can reuse it
  const patternId = `scene-pattern`;

  return (
    <div className="jigsaw-game glass-panel">
      <div className="header-row" style={{ marginBottom: '1rem' }}>
        <ListenButton text="הרכיבי את התמונה מחדש" />
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>פאזל תמונה</h2>
      </div>

      {/* SVG Defs for the common picture pattern */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <pattern id={patternId} patternUnits="userSpaceOnUse" width={totalW} height={totalH}>
            <svg width={totalW} height={totalH} viewBox="0 0 100 100" preserveAspectRatio="none">
              <linearGradient id={`grad-bg`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={scene.bg[0]} />
                <stop offset="100%" stopColor={scene.bg[1]} />
              </linearGradient>
              <rect width="100" height="100" fill="url(#grad-bg)" />
              {scene.elements.map((el, idx) => (
                <text 
                  key={idx} 
                  x={el.x} 
                  y={el.y} 
                  fontSize={el.size / 2} 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                >
                  {el.char}
                </text>
              ))}
            </svg>
          </pattern>
        </defs>
      </svg>

      <div className="jigsaw-layout">
        <div 
          className="jigsaw-board"
          style={{
            direction: 'ltr',
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
                      <svg viewBox={`${piece.c * 100} ${piece.r * 100} 100 100`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        <path d={piece.path} fill={`url(#${patternId})`} />
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
                <svg viewBox={`${piece.c * 100} ${piece.r * 100} 100 100`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <path d={piece.path} fill={`url(#${patternId})`} />
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
