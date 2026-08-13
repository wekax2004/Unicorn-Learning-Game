import { useRef, useEffect, useState, useMemo } from 'react';
import { CheckCircle2, Eraser } from 'lucide-react';
import ListenButton from './ListenButton';
import { playPop, playSuccess } from '../utils/audio';
import { HEBREW_LETTERS, NUMBERS, getRandomItems } from '../utils/content';
import './TracingGame.css';

export default function TracingGame({ onWin }) {
  const canvasRef = useRef(null);
  const targetPixelsRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [won, setWon] = useState(false);

  const targetSymbol = useMemo(() => getRandomItems([...HEBREW_LETTERS, ...NUMBERS], 1)[0], []);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 600;
      canvas.height = 400;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.lineWidth = 45; // thick brush for kids
      context.strokeStyle = '#c084fc';
      setCtx(context);
      
      initGame(context, canvas.width, canvas.height);
    }
  }, [targetSymbol]);

  const initGame = (context, w, h) => {
    context.clearRect(0, 0, w, h);
    context.fillStyle = '#e5e7eb'; // light gray target
    context.font = 'bold 300px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(targetSymbol, w / 2, h / 2 + 20);

    // Extract target pixels
    const imgData = context.getImageData(0, 0, w, h).data;
    const targetIndices = [];
    for (let i = 0; i < imgData.length; i += 4) {
      if (imgData[i+3] > 50) { // has opacity
        targetIndices.push(i);
      }
    }
    targetPixelsRef.current = targetIndices;
  };

  const getCoordinates = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    if (e.touches && e.touches.length > 0) {
      return {
        offsetX: (e.touches[0].clientX - rect.left) * scaleX,
        offsetY: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      offsetX: (e.clientX - rect.left) * scaleX,
      offsetY: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    if (!ctx) return;
    if (e.cancelable) e.preventDefault();
    setIsDrawing(true);
    playPop();
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const draw = (e) => {
    if (!isDrawing || !ctx) return;
    if (e.cancelable) e.preventDefault();
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const checkWin = () => {
    if (!ctx || !targetPixelsRef.current || won) return;
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;
    const imgData = ctx.getImageData(0, 0, w, h).data;
    
    let coveredCount = 0;
    const targetIndices = targetPixelsRef.current;
    
    for (let i = 0; i < targetIndices.length; i++) {
      const idx = targetIndices[i];
      // Purple stroke has a high blue channel (>240), whereas the light gray has ~235
      // Just check if it's distinctly the stroke color
      if (imgData[idx + 2] > 240 && imgData[idx] < 200) { 
        coveredCount++;
      }
    }
    
    const coverage = coveredCount / targetIndices.length;
    if (coverage > 0.50) { // 50% coverage is very forgiving
      setWon(true);
      playSuccess();
      if (onWin) setTimeout(onWin, 2500);
    }
  };

  const stopDrawing = () => {
    if (!ctx || !isDrawing) return;
    setIsDrawing(false);
    ctx.closePath();
    checkWin();
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    initGame(ctx, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="tracing-game">
      {won ? (
        <div className="success-screen">
          <CheckCircle2 size={120} color="#86efac" />
          <h1>ציור מקסים!</h1>
        </div>
      ) : (
        <div className="canvas-container glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <ListenButton text="כתבי את האותיות" />
            <h2 style={{ margin: 0 }}>ציירי את {targetSymbol}:</h2>
          </div>
          <canvas
            ref={canvasRef}
            className="drawing-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
          />
          <div className="canvas-controls">
            <button className="icon-btn erase-btn" onClick={clearCanvas}>
              <Eraser size={32} />
              נקה
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
