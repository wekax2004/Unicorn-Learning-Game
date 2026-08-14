import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import ListenButton from './ListenButton';
import { playPop, playSuccess } from '../utils/audio';
import { fireStickerSparkles } from '../utils/confetti';
import './BalloonPop.css';

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899'];

export default function BalloonPop({ onWin }) {
  const [balloons, setBalloons] = useState([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [won, setWon] = useState(false);
  const TARGET_POPS = 10;

  // Generate balloons periodically
  useEffect(() => {
    if (won) return;
    
    const interval = setInterval(() => {
      setBalloons(prev => {
        if (prev.length > 5) return prev; // max 5 on screen
        const newBalloon = {
          id: Date.now() + Math.random(),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          x: Math.random() * 80 + 10, // 10% to 90% width
          speed: Math.random() * 2 + 3 // 3 to 5 seconds to float up
        };
        return [...prev, newBalloon];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [won]);

  const handlePop = (id, e) => {
    playPop();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    fireStickerSparkles(x, y);

    setBalloons(prev => prev.filter(b => b.id !== id));
    
    setPoppedCount(prev => {
      const newCount = prev + 1;
      if (newCount >= TARGET_POPS && !won) {
        setWon(true);
        playSuccess();
        if (onWin) setTimeout(onWin, 3000);
      }
      return newCount;
    });
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
    <div className="balloon-pop-game glass-panel">
      <div className="header-row" style={{ zIndex: 10 }}>
        <ListenButton text="פוצצי את הבלונים שעפים למעלה!" />
        <h2>פוצצי בלונים! ({poppedCount}/{TARGET_POPS})</h2>
      </div>

      <div className="balloon-area">
        <AnimatePresence>
          {balloons.map(balloon => (
            <motion.div
              key={balloon.id}
              className="balloon"
              initial={{ y: '100vh', x: `${balloon.x}vw`, scale: 0 }}
              animate={{ y: '-20vh', scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                y: { duration: balloon.speed, ease: 'linear' },
                scale: { duration: 0.3 }
              }}
              onAnimationComplete={(def) => {
                // Remove if it floats off screen
                if (def.y === '-20vh') {
                  setBalloons(prev => prev.filter(b => b.id !== balloon.id));
                }
              }}
              onClick={(e) => handlePop(balloon.id, e)}
              style={{ backgroundColor: balloon.color }}
            >
              <div className="balloon-knot"></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
