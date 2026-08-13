import { useState } from 'react';
import { motion } from 'framer-motion';
import HoldButton from './HoldButton';
import ListenButton from './ListenButton';
import './StickerBook.css';

const ALL_STICKERS = [
  '🦄', '🦋', '🌈', '👑', '⭐', '🎈', '🍭', '🎀', '🌸', '💖', 
  '🍓', '🐬', '🐥', '🐰', '🧜‍♀️', '🏰', '🎨', '🧁', '🍦', '🎁'
];

export default function StickerBook({ wins, onClose }) {
  // 1 sticker for every 3 wins
  const earnedCount = Math.floor(wins / 3);
  
  return (
    <div className="sticker-book glass-panel">
      <div className="top-bar">
        <HoldButton onComplete={onClose} className="back-button">
          חזור (החזק)
        </HoldButton>
      </div>
      
      <div className="header-row" style={{ marginTop: '2rem' }}>
        <ListenButton text="ברוכה הבאה לאלבום המדבקות שלך!" />
        <h2>אלבום המדבקות שלי</h2>
      </div>
      
      <div className="progress-info">
        <p>ניצחת ב- <strong>{wins}</strong> משחקים!</p>
        <p>חסרים לך עוד <strong>{3 - (wins % 3)}</strong> ניצחונות כדי לקבל מדבקה חדשה!</p>
      </div>

      <div className="stickers-grid">
        {ALL_STICKERS.map((sticker, index) => {
          const isUnlocked = index < earnedCount;
          
          return (
            <motion.div 
              key={index}
              className={`sticker-slot ${isUnlocked ? 'unlocked' : 'locked'}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {isUnlocked ? (
                <span className="sticker-emoji">{sticker}</span>
              ) : (
                <span className="sticker-placeholder">?</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
