import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ListenButton from './ListenButton';
import { playPop, playSuccess } from '../utils/audio';
import { FRUITS_VEGGIES, ANIMALS, COLORS, getRandomItems } from '../utils/content';
import './SortingGame.css';

export default function SortingGame({ onWin }) {
  const [sorted, setSorted] = useState([]);
  
  const { mode, items, baskets, prompt } = useMemo(() => {
    const modes = ['color', 'type', 'category'];
    const selectedMode = modes[Math.floor(Math.random() * modes.length)];
    
    let pickedItems = [];
    let generatedBaskets = [];
    let generatedPrompt = '';
    
    if (selectedMode === 'color') {
      pickedItems = getRandomItems(FRUITS_VEGGIES, 4);
      const uniqueColors = [...new Set(pickedItems.map(item => item.color))];
      generatedBaskets = uniqueColors.map(color => ({
        id: color,
        icon: '', // colors just use the solid color bar
        bgColor: COLORS[color],
        borderColor: COLORS[color]
      }));
      generatedPrompt = 'מייני לפי צבע';
    } 
    else if (selectedMode === 'type') {
      const fruits = getRandomItems(FRUITS_VEGGIES.filter(i => i.type === 'fruit'), 2);
      const veggies = getRandomItems(FRUITS_VEGGIES.filter(i => i.type === 'veg'), 2);
      pickedItems = [...fruits, ...veggies].sort(() => 0.5 - Math.random());
      
      generatedBaskets = [
        { id: 'fruit', icon: '🍎', bgColor: '#fbcfe8', borderColor: '#ec4899' },
        { id: 'veg', icon: '🥕', bgColor: '#bbf7d0', borderColor: '#22c55e' }
      ];
      generatedPrompt = 'מייני פירות וירקות';
    }
    else {
      // category mode: Animals vs Food
      const animals = getRandomItems(ANIMALS, 2);
      const food = getRandomItems(FRUITS_VEGGIES, 2);
      pickedItems = [...animals, ...food].sort(() => 0.5 - Math.random());
      
      generatedBaskets = [
        { id: 'animal', icon: '🐶', bgColor: '#fef08a', borderColor: '#eab308' },
        { id: 'food', icon: '🍎', bgColor: '#fed7aa', borderColor: '#f97316' }
      ];
      
      // Map item types to basket ids
      pickedItems = pickedItems.map(item => ({
        ...item,
        basketTarget: item.type === 'animal' ? 'animal' : 'food'
      }));
      generatedPrompt = 'מייני חיות ואוכל';
    }
    
    return { mode: selectedMode, items: pickedItems, baskets: generatedBaskets, prompt: generatedPrompt };
  }, []);

  const handleDragEnd = (event, info, item) => {
    const dropTargets = document.elementsFromPoint(info.point.x, info.point.y);
    const targetEl = dropTargets.find(el => el.getAttribute('data-basket-id'));
    
    if (targetEl) {
      const basketId = targetEl.getAttribute('data-basket-id');
      const expectedId = item.basketTarget || item[mode];
      
      if (basketId === expectedId) {
        playPop();
        setSorted(prev => {
          const newSorted = [...prev, item.id];
          if (newSorted.length === items.length) {
            playSuccess();
            if (onWin) setTimeout(onWin, 2500);
          }
          return newSorted;
        });
      }
    }
  };

  if (sorted.length === items.length && items.length > 0) {
    return (
      <div className="success-screen">
        <div className="unicorn-success">🦄</div>
        <h1>כל הכבוד!</h1>
      </div>
    );
  }

  return (
    <div className="sorting-game glass-panel">
      <div className="header-row">
        <ListenButton text={prompt} />
        <h2>{prompt}</h2>
      </div>

      <div className="baskets-container">
        {baskets.map(basket => (
          <div 
            key={`basket-${basket.id}`} 
            className="basket"
            style={{ borderColor: basket.borderColor, backgroundColor: basket.bgColor }}
            data-basket-id={basket.id}
          >
            {basket.icon && <div className="basket-icon" style={{ fontSize: '3.5rem', opacity: 0.6, marginBottom: '10px' }}>{basket.icon}</div>}
            {!basket.icon && <div className="basket-label" style={{ backgroundColor: basket.borderColor }}></div>}
          </div>
        ))}
      </div>
      
      <div className="items-container">
        {items.map(item => {
          if (sorted.includes(item.id)) return <div key={`empty-${item.id}`} className="empty-slot"/>;
          
          return (
            <motion.div
              key={`item-${item.id}`}
              className="sortable-item"
              drag
              dragSnapToOrigin
              onDragEnd={(e, info) => handleDragEnd(e, info, item)}
              whileDrag={{ scale: 1.2, zIndex: 100 }}
            >
              <span className="item-icon">{item.icon}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
