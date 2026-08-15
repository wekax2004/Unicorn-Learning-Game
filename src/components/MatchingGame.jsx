import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import ListenButton from './ListenButton';
import { playPop, playSuccess, speakHebrew } from '../utils/audio';
import { HEBREW_LETTERS, NUMBERS, getRandomItems } from '../utils/content';
import './MatchingGame.css';

export default function MatchingGame({ onWin }) {
  const [matched, setMatched] = useState([]);
  
  // Pick 3 random items (letters or numbers)
  const roundItems = useMemo(() => {
    const all = [...HEBREW_LETTERS, ...NUMBERS];
    const picked = getRandomItems(all, 3);
    const colors = ['#fbcfe8', '#e9d5ff', '#c084fc', '#93c5fd', '#fde047'];
    return picked.map((char, i) => ({
      id: `m-${i}`,
      char,
      color: colors[i % colors.length]
    }));
  }, []);

  const handleDragEnd = (event, info, letter) => {
    const dropTargets = document.elementsFromPoint(info.point.x, info.point.y);
    const targetEl = dropTargets.find(el => el.getAttribute('data-target-id'));
    
    if (targetEl && targetEl.getAttribute('data-target-id') === letter.id) {
      playPop();
      setMatched(prev => {
        const newMatched = [...prev, letter.id];
        if (newMatched.length === roundItems.length) {
          playSuccess();
          if (onWin) setTimeout(onWin, 2500);
        }
        return newMatched;
      });
    }
  };

  if (matched.length === roundItems.length && roundItems.length > 0) {
    return (
      <div className="success-screen">
        <div className="unicorn-success">🦄</div>
        <h1>כל הכבוד!</h1>
      </div>
    );
  }

  return (
    <div className="matching-game glass-panel" style={{ padding: '2rem', width: '90%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <ListenButton text="התאימי את הצורה לצללית שלה" />
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>התאימי את הצורה לצללית שלה</h2>
      </div>

      <div className="targets-container">
        {roundItems.map(letter => (
          <div 
            key={`target-${letter.id}`} 
            className={`target ${matched.includes(letter.id) ? 'matched' : ''}`}
            data-target-id={letter.id}
          >
            {letter.char}
          </div>
        ))}
      </div>
      
      <div className="draggables-container">
        {roundItems.map(letter => {
          if (matched.includes(letter.id)) return <div key={`empty-${letter.id}`} style={{width: 120, height: 120}}/>;
          
          return (
            <motion.div
              key={`drag-${letter.id}`}
              className="draggable"
              style={{ backgroundColor: letter.color }}
              drag
              dragSnapToOrigin
              onDragStart={() => speakHebrew(letter.char)}
              onDragEnd={(e, info) => handleDragEnd(e, info, letter)}
              whileDrag={{ scale: 1.2, zIndex: 100 }}
            >
              {letter.char}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
