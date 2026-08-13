import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import ListenButton from './ListenButton';
import { playPop, playSuccess } from '../utils/audio';
import './MazeGame.css';

const MAZES = [
  {
    name: 'L-Shape',
    grid: [
      ['S', '.', '#', '#'],
      ['#', '.', '#', '#'],
      ['#', '.', '.', 'E'],
      ['#', '#', '#', '#']
    ]
  },
  {
    name: 'Zig-Zag',
    grid: [
      ['S', '.', '#', '#'],
      ['#', '.', '.', '#'],
      ['#', '#', '.', '.'],
      ['#', '#', '#', 'E']
    ]
  },
  {
    name: 'U-Shape',
    grid: [
      ['S', '.', '.', '.'],
      ['#', '#', '#', '.'],
      ['E', '.', '.', '.'],
      ['#', '#', '#', '#']
    ]
  },
  {
    name: 'Staircase',
    grid: [
      ['S', '#', '#', '#'],
      ['.', '.', '#', '#'],
      ['#', '.', '.', '#'],
      ['#', '#', '.', 'E']
    ]
  },
  {
    name: 'S-Curve',
    grid: [
      ['S', '.', '.', '#'],
      ['#', '#', '.', '#'],
      ['.', '.', '.', '#'],
      ['E', '#', '#', '#']
    ]
  }
];

export default function MazeGame({ onWin }) {
  const [won, setWon] = useState(false);
  const containerRef = useRef(null);
  const controls = useAnimation();
  
  const maze = useMemo(() => {
    return MAZES[Math.floor(Math.random() * MAZES.length)];
  }, []);

  const handleDrag = (e, info) => {
    if (won) return;
    
    // Use standard touch coordinates if available, otherwise mouse point
    const clientX = e.touches ? e.touches[0].clientX : info.point.x;
    const clientY = e.touches ? e.touches[0].clientY : info.point.y;
    
    const elements = document.elementsFromPoint(clientX, clientY);
    
    const isWall = elements.some(el => el.getAttribute('data-wall') === 'true');
    const isEnd = elements.some(el => el.getAttribute('data-end') === 'true');
    
    if (isWall) {
      // Small boop to indicate hitting a wall
      playPop();
    }
    
    if (isEnd && !won) {
      setWon(true);
      playSuccess();
      if (onWin) setTimeout(onWin, 2500);
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
    <div className="maze-game glass-panel">
      <div className="header-row">
        <ListenButton text="עזרי לחד-קרן להגיע לכוכב, והיזהרי מהקירות!" />
        <h2>עזרי לחד-קרן להגיע לכוכב!</h2>
      </div>

      <div className="maze-grid-container" ref={containerRef}>
        {maze.grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const isWall = cell === '#';
            const isStart = cell === 'S';
            const isEnd = cell === 'E';
            
            return (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className={`maze-cell ${isWall ? 'wall' : 'path'}`}
                data-wall={isWall}
                data-end={isEnd}
              >
                {isEnd && <span className="maze-star">⭐</span>}
              </div>
            );
          })
        ))}
        
        {/* The Unicorn is absolutely positioned and draggable over the grid */}
        <motion.div
          className="maze-unicorn"
          drag
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={containerRef}
          onDrag={handleDrag}
          animate={controls}
          style={{
            // Position unicorn at the start cell initially. 
            // In a 4x4 grid, if 'S' is at 0,0 it's top left.
            position: 'absolute',
            top: `${(maze.grid.findIndex(row => row.includes('S'))) * 25}%`,
            left: `${(maze.grid.find(row => row.includes('S')).indexOf('S')) * 25}%`,
            width: '25%',
            height: '25%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3.5rem',
            zIndex: 10,
            cursor: 'grab'
          }}
          whileTap={{ cursor: 'grabbing', scale: 1.1 }}
        >
          🦄
        </motion.div>
      </div>
    </div>
  );
}
