import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import ListenButton from './ListenButton';
import { playPop, playSuccess, speakHebrew, playItemSound } from '../utils/audio';
import { ALL_OBJECTS, getRandomItems } from '../utils/content';
import './BubblePopGame.css';

export default function BubblePopGame({ onWin }) {
  const [bubbles, setBubbles] = useState([]);
  const [won, setWon] = useState(false);
  const [poppedCount, setPoppedCount] = useState(0);
  const [shouldSpeak, setShouldSpeak] = useState(true);

  // Pick a target item to find
  const targetItem = useMemo(() => {
    return getRandomItems(ALL_OBJECTS, 1)[0];
  }, []);

  const WIN_TARGET = 5;

  // Auto-speak when game mounts
  useEffect(() => {
    if (shouldSpeak && 'speechSynthesis' in window) {
      setTimeout(() => {
        speakHebrew(`פוצצי את הבועות של ה${targetItem.name}!`);
      }, 500);
      setShouldSpeak(false);
    }
  }, [shouldSpeak, targetItem.name]);

  // Bubble spawner
  useEffect(() => {
    if (won) return;

    const spawnBubble = () => {
      // 40% chance to be the target item, 60% chance to be random
      const isTarget = Math.random() > 0.6;
      const item = isTarget ? targetItem : getRandomItems(ALL_OBJECTS, 1)[0];
      
      const newBubble = {
        id: Math.random().toString(36).substr(2, 9),
        item,
        x: Math.random() * 80 + 10, // 10% to 90% width
        speed: Math.random() * 4 + 6, // 6 to 10 seconds to float up
        size: Math.random() * 30 + 80 // 80px to 110px
      };

      setBubbles(prev => [...prev, newBubble]);
    };

    const interval = setInterval(spawnBubble, 1200);
    return () => clearInterval(interval);
  }, [won, targetItem]);

  // Clean up bubbles that go off screen
  useEffect(() => {
    const cleanup = setInterval(() => {
      setBubbles(prev => prev.slice(-15)); // Keep max 15 on screen to avoid lag
    }, 5000);
    return () => clearInterval(cleanup);
  }, []);

  const handlePop = (bubble) => {
    if (won) return;
    
    // Remove bubble
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));
    
    if (bubble.item.id === targetItem.id) {
      // Correct!
      playPop();
      const newCount = poppedCount + 1;
      setPoppedCount(newCount);
      
      if (newCount >= WIN_TARGET) {
        setWon(true);
        playSuccess();
        if (onWin) setTimeout(onWin, 2500);
      }
    } else {
      // Wrong! Still pop it but read its name
      playItemSound(bubble.item.id);
      speakHebrew(bubble.item.name);
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
    <div className="bubble-game glass-panel">
      <div className="header-row" style={{ position: 'relative', zIndex: 10 }}>
        <ListenButton text={`פוצצי את הבועות של ה${targetItem.name}!`} />
        <h2>פוצצי את: {targetItem.icon} {targetItem.name} ({poppedCount}/{WIN_TARGET})</h2>
      </div>

      <div className="bubble-container">
        <AnimatePresence>
          {bubbles.map(bubble => (
            <motion.div
              key={bubble.id}
              className="bubble"
              initial={{ y: 500, opacity: 0, scale: 0.5 }}
              animate={{ y: -600, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
              transition={{ duration: bubble.speed, ease: 'linear' }}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePop(bubble);
              }}
              style={{
                width: bubble.size,
                height: bubble.size,
                left: `${bubble.x}%`
              }}
            >
              <span style={{ fontSize: bubble.size * 0.5 }}>{bubble.item.icon}</span>
              <div className="bubble-highlight"></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
