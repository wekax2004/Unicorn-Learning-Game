import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fireStickerSparkles } from '../utils/confetti';
import './TreasureChest.css';

export default function TreasureChest({ onOpen, stickerEmoji }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (e) => {
    if (isOpen) return;
    setIsOpen(true);
    
    // Fire sparkles from the chest's location
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    fireStickerSparkles(x, y);

    // Notify parent after animation
    setTimeout(() => {
      if (onOpen) onOpen();
    }, 2500);
  };

  return (
    <div className="treasure-chest-container">
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            className="treasure-chest closed"
            onClick={handleOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              rotate: [0, -5, 5, -5, 5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <div className="chest-emoji">📦</div>
            <div className="chest-glow" />
            <p className="chest-label">לחצי לפתיחה!</p>
          </motion.div>
        ) : (
          <motion.div
            className="treasure-chest open"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="chest-emoji">🎁</div>
            <motion.div 
              className="reward-sticker"
              initial={{ y: 50, scale: 0 }}
              animate={{ y: -50, scale: 2 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              {stickerEmoji}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
