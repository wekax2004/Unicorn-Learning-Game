import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ListenButton from './ListenButton';
import { playPop, playSuccess } from '../utils/audio';
import { getRandomItems } from '../utils/content';
import './ClockGame.css';

export default function ClockGame({ onWin }) {
  const [round, setRound] = useState(0);
  const [won, setWon] = useState(false);
  const [shakeId, setShakeId] = useState(null);

  const { targetHour, options } = useMemo(() => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const target = hours[Math.floor(Math.random() * 12)];
    const others = hours.filter(h => h !== target);
    const randomOthers = getRandomItems(others, 2);
    const opts = getRandomItems([target, ...randomOthers], 3);
    
    return { targetHour: target, options: opts };
  }, [round]);

  const handleTap = (hour) => {
    if (hour === targetHour) {
      playPop();
      if (round < 2) {
        setRound(r => r + 1);
      } else {
        playSuccess();
        setWon(true);
        if (onWin) setTimeout(onWin, 2500);
      }
    } else {
      setShakeId(hour);
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

  // Calculate angles for clock hands
  const hourAngle = (targetHour % 12) * 30; // 360 / 12
  const minuteAngle = 0; // Always 0 for whole hours

  return (
    <div className="clock-game glass-panel">
      <div className="header-row">
        <ListenButton text="מה השעה?" />
        <h2>מה השעה?</h2>
      </div>

      <div className="clock-container">
        <svg viewBox="0 0 100 100" className="clock-svg">
          <circle cx="50" cy="50" r="45" className="clock-face" />
          
          {/* Numbers 1-12 */}
          {Array.from({ length: 12 }).map((_, i) => {
            const num = i + 1;
            const angle = (num * 30 - 90) * (Math.PI / 180);
            const x = 50 + 35 * Math.cos(angle);
            const y = 50 + 35 * Math.sin(angle);
            return (
              <text key={num} x={x} y={y} className="clock-number" dominantBaseline="central" textAnchor="middle">
                {num}
              </text>
            );
          })}

          {/* Hour Hand */}
          <line
            x1="50" y1="50"
            x2="50" y2="25"
            className="hour-hand"
            transform={`rotate(${hourAngle} 50 50)`}
          />

          {/* Minute Hand */}
          <line
            x1="50" y1="50"
            x2="50" y2="15"
            className="minute-hand"
            transform={`rotate(${minuteAngle} 50 50)`}
          />
          
          <circle cx="50" cy="50" r="3" className="clock-center" />
        </svg>
      </div>

      <div className="clock-options">
        {options.map((opt) => (
          <motion.div
            key={opt}
            className={`clock-option ${shakeId === opt ? 'shake' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTap(opt)}
          >
            {opt}:00
          </motion.div>
        ))}
      </div>
    </div>
  );
}
