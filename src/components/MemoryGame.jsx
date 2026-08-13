import { useState, useMemo, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import ListenButton from './ListenButton';
import { playPop, playSuccess } from '../utils/audio';
import { ANIMALS, getRandomItems } from '../utils/content';
import './MemoryGame.css';

export default function MemoryGame({ onWin }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [won, setWon] = useState(false);

  useEffect(() => {
    // Pick 2 random animals, duplicate them, and shuffle
    const picked = getRandomItems(ANIMALS, 2);
    const pairs = [...picked, ...picked];
    const shuffled = pairs.sort(() => 0.5 - Math.random());
    setCards(shuffled.map((item, idx) => ({ ...item, uniqueId: `${item.id}-${idx}` })));
  }, []);

  const handleCardClick = (index) => {
    if (flipped.length === 2) return;
    if (flipped.includes(index)) return;
    if (matched.includes(cards[index].id)) return;

    playPop();
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = cards[newFlipped[0]];
      const card2 = cards[newFlipped[1]];

      if (card1.id === card2.id) {
        // Match!
        setTimeout(() => {
          setMatched(prev => {
            const newMatched = [...prev, card1.id];
            if (newMatched.length === 2) {
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

  return (
    <div className="memory-game glass-panel">
      <div className="header-row">
        <ListenButton text="מצאי את הזוגות התואמים" />
        <h2>מצאי זוגות</h2>
      </div>

      <div className="memory-grid">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(card.id);
          return (
            <div 
              key={card.uniqueId} 
              className={`memory-card ${isFlipped ? 'flipped' : ''}`}
              onClick={() => handleCardClick(index)}
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
