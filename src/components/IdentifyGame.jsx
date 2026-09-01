import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import ListenButton from './ListenButton';
import { playPop, playSuccess, playItemSound, speakHebrew } from '../utils/audio';
import { ALL_OBJECTS, getRandomItems } from '../utils/content';
import './IdentifyGame.css';

export default function IdentifyGame({ onWin }) {
  const [won, setWon] = useState(false);
  const [shouldSpeak, setShouldSpeak] = useState(true);

  const { targetItem, options } = useMemo(() => {
    // We want to identify fruits/veggies mostly, but can use ALL_OBJECTS
    const pickedOptions = getRandomItems(ALL_OBJECTS, 4);
    const target = pickedOptions[Math.floor(Math.random() * pickedOptions.length)];
    return { targetItem: target, options: pickedOptions };
  }, []);

  // Auto-speak when game mounts
  useEffect(() => {
    if (shouldSpeak && 'speechSynthesis' in window) {
      setTimeout(() => {
        const msg = new SpeechSynthesisUtterance(`איפה ${targetItem.name}?`);
        msg.lang = 'he-IL';
        window.speechSynthesis.speak(msg);
      }, 500);
      setShouldSpeak(false);
    }
  }, [shouldSpeak, targetItem.name]);

  const handleTap = (item) => {
    speakHebrew(item.name || item.id);
    if (item.id === targetItem.id) {
      playItemSound(item.id);
      playSuccess();
      setWon(true);
      if (onWin) setTimeout(onWin, 2500);
    } else {
      playItemSound(item.id);
    }
  };

  if (won) {
    return (
      <div className="success-screen">
        <div className="unicorn-success">🦄</div>
        <h1>כל הכבוד!</h1>
      </div>
    );
  }

  return (
    <div className="identify-game glass-panel">
      <div className="header-row">
        <ListenButton text={`איפה ${targetItem.name}?`} />
        <h2>איפה {targetItem.name}?</h2>
      </div>

      <div className="options-grid">
        {options.map((opt) => (
          <motion.div
            key={opt.id}
            className="identify-option"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTap(opt)}
            onTouchEnd={(e) => {
              e.preventDefault(); // prevent double firing
              handleTap(opt);
            }}
          >
            <span className="big-emoji">{opt.icon}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
