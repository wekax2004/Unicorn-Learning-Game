import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Palette } from 'lucide-react';
import ListenButton from './ListenButton';
import { playPop, playSuccess } from '../utils/audio';
import './ColoringGame.css';

const PALETTE = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#ffffff', // White
];

const TEMPLATES = [
  {
    id: 'house',
    parts: ['sky', 'sun', 'house', 'roof', 'door', 'trunk', 'leaves'],
    render: (fills, handleColor) => (
      <>
        <rect id="sky" x="0" y="0" width="200" height="200" fill={fills['sky'] || '#ffffff'} onClick={() => handleColor('sky')} stroke="black" strokeWidth="1" />
        <circle id="sun" cx="160" cy="40" r="25" fill={fills['sun'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('sun'); }} />
        <rect id="house" x="40" y="100" width="80" height="80" fill={fills['house'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('house'); }} />
        <polygon id="roof" points="30,100 80,50 130,100" fill={fills['roof'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('roof'); }} />
        <rect id="door" x="65" y="130" width="30" height="50" fill={fills['door'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('door'); }} />
        <rect id="trunk" x="145" y="120" width="20" height="60" fill={fills['trunk'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('trunk'); }} />
        <circle id="leaves" cx="155" cy="110" r="30" fill={fills['leaves'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('leaves'); }} />
      </>
    )
  },
  {
    id: 'boat',
    parts: ['sky', 'water', 'hull', 'sail1', 'sail2', 'mast', 'sun'],
    render: (fills, handleColor) => (
      <>
        <rect id="sky" x="0" y="0" width="200" height="140" fill={fills['sky'] || '#ffffff'} onClick={() => handleColor('sky')} stroke="black" strokeWidth="1" />
        <rect id="water" x="0" y="140" width="200" height="60" fill={fills['water'] || '#ffffff'} onClick={() => handleColor('water')} stroke="black" strokeWidth="2" />
        <circle id="sun" cx="40" cy="40" r="20" fill={fills['sun'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('sun'); }} />
        <polygon id="hull" points="40,140 160,140 140,170 60,170" fill={fills['hull'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('hull'); }} />
        <rect id="mast" x="95" y="50" width="6" height="90" fill={fills['mast'] || '#ffffff'} stroke="black" strokeWidth="3" onClick={(e) => { e.stopPropagation(); handleColor('mast'); }} />
        <polygon id="sail1" points="95,55 95,130 45,130" fill={fills['sail1'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('sail1'); }} />
        <polygon id="sail2" points="101,65 101,130 145,130" fill={fills['sail2'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('sail2'); }} />
      </>
    )
  },
  {
    id: 'flower',
    parts: ['sky', 'stem', 'leaf1', 'leaf2', 'center', 'petal1', 'petal2', 'petal3', 'petal4'],
    render: (fills, handleColor) => (
      <>
        <rect id="sky" x="0" y="0" width="200" height="200" fill={fills['sky'] || '#ffffff'} onClick={() => handleColor('sky')} stroke="black" strokeWidth="1" />
        <rect id="stem" x="95" y="100" width="10" height="100" fill={fills['stem'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('stem'); }} />
        <path id="leaf1" d="M95,150 Q50,130 95,180" fill={fills['leaf1'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('leaf1'); }} />
        <path id="leaf2" d="M105,140 Q150,120 105,170" fill={fills['leaf2'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('leaf2'); }} />
        
        <circle id="petal1" cx="100" cy="50" r="25" fill={fills['petal1'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('petal1'); }} />
        <circle id="petal2" cx="100" cy="110" r="25" fill={fills['petal2'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('petal2'); }} />
        <circle id="petal3" cx="70" cy="80" r="25" fill={fills['petal3'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('petal3'); }} />
        <circle id="petal4" cx="130" cy="80" r="25" fill={fills['petal4'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('petal4'); }} />
        
        <circle id="center" cx="100" cy="80" r="20" fill={fills['center'] || '#ffffff'} stroke="black" strokeWidth="4" onClick={(e) => { e.stopPropagation(); handleColor('center'); }} />
      </>
    )
  }
];

export default function ColoringGame({ onWin }) {
  const [template] = useState(() => TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)]);
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
  const [fills, setFills] = useState({});
  const [won, setWon] = useState(false);

  const handleColor = (id) => {
    if (won) return;
    setFills(prev => {
      const newFills = { ...prev, [id]: selectedColor };
      playPop();
      
      // Check if all essential parts are colored
      // We consider it won if ALL parts are painted with something other than white
      const coloredParts = Object.values(newFills).filter(color => color !== '#ffffff');
      if (coloredParts.length === template.parts.length && !won) {
        setWon(true);
        playSuccess();
        if (onWin) setTimeout(onWin, 3000);
      }
      return newFills;
    });
  };

  return (
    <div className="coloring-game glass-panel">
      <div className="header-row">
        <ListenButton text="בחרי צבע וצבעי את הציור!" />
        <h2>צביעה</h2>
      </div>

      <div className="canvas-container">
        <svg viewBox="0 0 200 200" className="coloring-svg">
          {template.render(fills, handleColor)}
        </svg>

        {won && (
          <motion.div className="success-overlay" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle2 size={100} color="#86efac" />
            <h3>יצירת מופת!</h3>
          </motion.div>
        )}
      </div>

      <div className="palette-container">
        {PALETTE.map(color => (
          <button
            key={color}
            className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );
}
