import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import ListenButton from './ListenButton';
import { playPop, playSuccess, speakHebrew, playItemSound } from '../utils/audio';
import { ALL_OBJECTS, getRandomItems } from '../utils/content';
import './DifferencesGame.css';

export default function DifferencesGame({ onWin }) {
  const [won, setWon] = useState(false);
  const [shouldSpeak, setShouldSpeak] = useState(true);

  // Generate 2 rows of 4 items. The bottom row has 1 item changed.
  const { topRow, bottomRow, differenceId } = useMemo(() => {
    // Pick 5 items (4 for the top row, 1 for the difference)
    const picked = getRandomItems(ALL_OBJECTS, 5);
    const baseItems = picked.slice(0, 4);
    const replacementItem = picked[4];

    // Pick a random index to change in the bottom row
    const diffIndex = Math.floor(Math.random() * 4);
    
    const bottomItems = [...baseItems];
    bottomItems[diffIndex] = replacementItem;

    // We assign unique IDs so React rendering is happy
    const topRender = baseItems.map((item, idx) => ({ ...item, uniqueId: `top-${idx}` }));
    const bottomRender = bottomItems.map((item, idx) => ({ ...item, uniqueId: `bottom-${idx}`, isDiff: idx === diffIndex }));

    return { topRow: topRender, bottomRow: bottomRender, differenceId: replacementItem.uniqueId };
  }, []);

  useEffect(() => {
    if (shouldSpeak && 'speechSynthesis' in window) {
      setTimeout(() => {
        speakHebrew("מצאי את ההבדל");
      }, 500);
      setShouldSpeak(false);
    }
  }, [shouldSpeak]);

  const handleTap = (item) => {
    speakHebrew(item.name || item.id);
    playItemSound(item.id);

    if (item.isDiff) {
      playSuccess();
      setWon(true);
      if (onWin) setTimeout(onWin, 3000);
    } else {
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
    <div className="differences-game glass-panel">
      <div className="header-row">
        <ListenButton text="מצאי את ההבדל בשורה התחתונה" />
        <h2>מצאי את ההבדל</h2>
      </div>

      <div className="differences-layout">
        <div className="diff-row top-row">
          {topRow.map(item => (
            <div key={item.uniqueId} className="diff-card locked">
              <span className="diff-emoji">{item.icon}</span>
            </div>
          ))}
        </div>

        <div className="diff-divider" />

        <div className="diff-row bottom-row">
          {bottomRow.map(item => (
            <motion.div
              key={item.uniqueId}
              className="diff-card clickable"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTap(item)}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTap(item);
              }}
            >
              <span className="diff-emoji">{item.icon}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
