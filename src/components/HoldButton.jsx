import { useState, useRef, useEffect } from 'react';

export default function HoldButton({ onComplete, children, style, className = "" }) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const DURATION = 2000; // 2 seconds

  const startHold = (e) => {
    e.preventDefault();
    setIsHolding(true);
    startTimeRef.current = performance.now();
    
    const updateProgress = (timestamp) => {
      if (!startTimeRef.current) return;
      
      const elapsed = timestamp - startTimeRef.current;
      const currentProgress = Math.min((elapsed / DURATION) * 100, 100);
      
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        setIsHolding(false);
        setProgress(0);
        startTimeRef.current = null;
        onComplete();
      } else {
        animationRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animationRef.current = requestAnimationFrame(updateProgress);
  };

  const endHold = () => {
    setIsHolding(false);
    setProgress(0);
    startTimeRef.current = null;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <button
      className={`hold-button ${className}`}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      onTouchCancel={endHold}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: `${progress}%`,
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          transition: 'width 0.1s linear'
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
}
