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

export default function ColoringGame({ onWin }) {
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
  const [fills, setFills] = useState({});
  const [won, setWon] = useState(false);

  const handleColor = (id) => {
    if (won) return;
    setFills(prev => {
      const newFills = { ...prev, [id]: selectedColor };
      playPop();
      
      // Check if all parts are colored (exclude white)
      const coloredParts = Object.values(newFills).filter(color => color !== '#ffffff');
      if (coloredParts.length >= 6 && !won) {
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
          {/* Background/Sky */}
          <rect 
            id="sky"
            x="0" y="0" width="200" height="200" 
            fill={fills['sky'] || '#ffffff'} 
            onClick={() => handleColor('sky')} 
            stroke="black" strokeWidth="1"
          />
          {/* Sun */}
          <circle 
            id="sun"
            cx="160" cy="40" r="25" 
            fill={fills['sun'] || '#ffffff'} 
            stroke="black" strokeWidth="4" 
            onClick={(e) => { e.stopPropagation(); handleColor('sun'); }} 
          />
          {/* House Base */}
          <rect 
            id="house"
            x="40" y="100" width="80" height="80" 
            fill={fills['house'] || '#ffffff'} 
            stroke="black" strokeWidth="4"
            onClick={(e) => { e.stopPropagation(); handleColor('house'); }} 
          />
          {/* House Roof */}
          <polygon 
            id="roof"
            points="30,100 80,50 130,100" 
            fill={fills['roof'] || '#ffffff'} 
            stroke="black" strokeWidth="4"
            onClick={(e) => { e.stopPropagation(); handleColor('roof'); }} 
          />
          {/* Door */}
          <rect 
            id="door"
            x="65" y="130" width="30" height="50" 
            fill={fills['door'] || '#ffffff'} 
            stroke="black" strokeWidth="4"
            onClick={(e) => { e.stopPropagation(); handleColor('door'); }} 
          />
          {/* Tree Trunk */}
          <rect 
            id="trunk"
            x="145" y="120" width="20" height="60" 
            fill={fills['trunk'] || '#ffffff'} 
            stroke="black" strokeWidth="4"
            onClick={(e) => { e.stopPropagation(); handleColor('trunk'); }} 
          />
          {/* Tree Leaves */}
          <circle 
            id="leaves"
            cx="155" cy="110" r="30" 
            fill={fills['leaves'] || '#ffffff'} 
            stroke="black" strokeWidth="4"
            onClick={(e) => { e.stopPropagation(); handleColor('leaves'); }} 
          />
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
