import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ListenButton from './ListenButton';
import { playPop, playSuccess } from '../utils/audio';
import { getRandomItems } from '../utils/content';
import './SyllableGame.css';

const WORDS = [
  { word: 'אבא', parts: ['אָ', 'בָּא'] },
  { word: 'אמא', parts: ['אִ', 'מָּא'] },
  { word: 'בובה', parts: ['בּוּ', 'בָּה'] },
  { word: 'דג', parts: ['דָּ', 'ג'] },
  { word: 'גמל', parts: ['גָּ', 'מָל'] },
  { word: 'דוב', parts: ['דוּ', 'ב'] },
  { word: 'בית', parts: ['בַּ', 'יִת'] },
  { word: 'ילד', parts: ['יֶ', 'לֶד'] },
];

export default function SyllableGame({ onWin }) {
  const [round, setRound] = useState(0);
  const [won, setWon] = useState(false);
  const [placedParts, setPlacedParts] = useState([]);
  const [shakeId, setShakeId] = useState(null);

  const { targetObj, shuffledParts } = useMemo(() => {
    const pickedWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    // Add unique IDs to parts so we can safely map them even if duplicated characters exist
    const partsWithIds = pickedWord.parts.map((p, i) => ({ text: p, id: `${i}-${p}`, originalIndex: i }));
    return {
      targetObj: pickedWord,
      shuffledParts: getRandomItems(partsWithIds, partsWithIds.length)
    };
  }, [round]);

  const handleTap = (part) => {
    // Check if part matches the next expected syllable
    const expectedIndex = placedParts.length;
    if (part.originalIndex === expectedIndex) {
      playPop();
      const newPlaced = [...placedParts, part];
      setPlacedParts(newPlaced);
      
      if (newPlaced.length === targetObj.parts.length) {
        if (round < 2) {
          setTimeout(() => {
            setRound(r => r + 1);
            setPlacedParts([]);
          }, 1000);
        } else {
          playSuccess();
          setTimeout(() => {
            setWon(true);
            if (onWin) setTimeout(onWin, 2500);
          }, 1000);
        }
      }
    } else {
      setShakeId(part.id);
      setTimeout(() => setShakeId(null), 500);
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
    <div className="syllable-game glass-panel">
      <div className="header-row">
        <ListenButton text={`חברי את המילה ${targetObj.word}`} />
        <h2>חברי את המילה</h2>
      </div>

      <div className="word-building-area">
        {targetObj.parts.map((_, i) => (
          <div key={i} className="syllable-slot">
            {placedParts[i] ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="placed-part">
                {placedParts[i].text}
              </motion.div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="parts-options">
        {shuffledParts.map(part => {
          const isPlaced = placedParts.some(p => p.id === part.id);
          return (
            <motion.button
              key={part.id}
              className={`syllable-btn ${shakeId === part.id ? 'shake' : ''} ${isPlaced ? 'hidden' : ''}`}
              whileHover={!isPlaced ? { scale: 1.05 } : {}}
              whileTap={!isPlaced ? { scale: 0.95 } : {}}
              onClick={() => !isPlaced && handleTap(part)}
              disabled={isPlaced}
            >
              {part.text}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
