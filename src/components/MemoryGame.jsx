import { useState, useMemo, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import ListenButton from './ListenButton';
import { playPop, playSuccess, playAnimalSound } from '../utils/audio';
import { ANIMALS, getRandomItems } from '../utils/content';
import './MemoryGame.css';

const DIFFICULTIES = [
  { id: 'easy', label: '2 זוגות', pairs: 2 },
  { id: 'medium', label: '4 זוגות', pairs: 4 },
  { id: 'hard', label: '8 זוגות', pairs: 8 },
  { id: 'expert', label: '12 זוגות', pairs: 12 },
  { id: 'insane', label: '20 זוגות', pairs: 20 }
];

export default function MemoryGame({ onWin }) {
  const [difficulty] = useState(() => DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)]);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (!difficulty) return;
    
    // Pick N random animals, duplicate them, and shuffle
    // Ensure we don't request more animals than exist in the dictionary!
    // The ANIMALS array currently has a limited number. Let's make sure it handles up to 20.
    // If we request 20 but ANIMALS has 10, getRandomItems might return duplicates or fail.
    // To fix this, if pairs > ANIMALS.length, we can just use ANIMALS and cycle through them.
    let picked = [];
    if (difficulty.pairs <= ANIMALS.length) {
      picked = getRandomItems(ANIMALS, difficulty.pairs);
    } else {
      // If we need more pairs than available animals, cycle through them
      for (let i = 0; i < difficulty.pairs; i++) {
        picked.push(ANIMALS[i % ANIMALS.length]);
      }
    }
    
    const pairs = [...picked, ...picked];
    const shuffled = pairs.sort(() => 0.5 - Math.random());
    setCards(shuffled.map((item, idx) => ({ ...item, uniqueId: `${item.id}-${idx}` })));
  }, [difficulty]);

  const handleCardClick = (index) => {
    if (flipped.length === 2) return;
    if (flipped.includes(index)) return;
    if (matched.includes(cards[index].id)) return; // Use uniqueId for logic if duplicated animals!
    // Wait, if we use duplicate animals because of 'insane' mode, card.id might match 4 cards!
    // So we must match by card.id, but ensure we don't accidentally match 3+ cards at once.
    // To be safe, we'll just check if the specific card index is already matched.
    if (matched.includes(cards[index].uniqueId)) return;

    playAnimalSound(cards[index].id);
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = cards[newFlipped[0]];
      const card2 = cards[newFlipped[1]];

      if (card1.id === card2.id) {
        // Match!
        setTimeout(() => {
          setMatched(prev => {
            const newMatched = [...prev, card1.uniqueId, card2.uniqueId];
            if (newMatched.length === cards.length) {
              playSuccess();
              setWon(true);
              if (onWin) setTimeout(onWin, 2500);
            }
            return newMatched;
          });
          setFlipped([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
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

  // Use auto-fit grid so cards never form a single row if they don't fit
  const minWidth = difficulty.pairs >= 12 ? '50px' : (difficulty.pairs >= 8 ? '60px' : '75px');
  const gridStyle = { gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))` };

  return (
    <div className="memory-game glass-panel" style={{ overflowY: 'auto', maxHeight: '100vh', paddingBottom: '5rem' }}>
      <div className="header-row">
        <ListenButton text="מצאי את הזוגות התואמים" />
        <h2>מצאי זוגות</h2>
      </div>

      <div className="memory-grid" style={gridStyle}>
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(card.uniqueId);
          return (
            <div 
              key={card.uniqueId} 
              className={`memory-card ${isFlipped ? 'flipped' : ''}`}
              onClick={() => handleCardClick(index)}
              style={difficulty.pairs >= 12 ? { width: '50px', height: '50px', fontSize: '1.5rem' } : {}}
            >
              <div className="card-inner">
                <div className="card-front">
                  <span>✨</span>
                </div>
                <div className="card-back">
                  <span className="card-icon">{card.icon}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

