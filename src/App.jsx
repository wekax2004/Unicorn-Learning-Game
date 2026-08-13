import { useState, useRef, useEffect } from 'react';
import './App.css';
import HoldButton from './components/HoldButton';
import MatchingGame from './components/MatchingGame';
import MazeGame from './components/MazeGame';
import TracingGame from './components/TracingGame';
import CountingGame from './components/CountingGame';
import PuzzleGame from './components/PuzzleGame';
import SortingGame from './components/SortingGame';
import MemoryGame from './components/MemoryGame';
import IdentifyGame from './components/IdentifyGame';
import ColoringGame from './components/ColoringGame';
import SizeGame from './components/SizeGame';
import StickerBook from './components/StickerBook';
import { Sparkles, Route, Shapes, PenTool, Hash, Puzzle, Combine, Grip, Search, Star, Music, Music2, Palette, Maximize } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('hub');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  
  // Progression System
  const [wins, setWins] = useState(() => {
    const saved = localStorage.getItem('unicornWins');
    return saved ? parseInt(saved, 10) : 0;
  });

  const games = [
    { id: 'matching', name: 'התאמה', icon: Shapes, color: '#fbcfe8' },
    { id: 'maze', name: 'מבוך', icon: Route, color: '#e9d5ff' },
    { id: 'tracing', name: 'כתיבה', icon: PenTool, color: '#c084fc' },
    { id: 'counting', name: 'ספירה', icon: Hash, color: '#fde047' },
    { id: 'puzzle', name: 'פאזל', icon: Puzzle, color: '#86efac' },
    { id: 'sorting', name: 'מיון', icon: Combine, color: '#93c5fd' },
    { id: 'memory', name: 'זיכרון', icon: Grip, color: '#fca5a5' },
    { id: 'identify', name: 'זיהוי', icon: Search, color: '#fcd34d' },
    { id: 'coloring', name: 'צביעה', icon: Palette, color: '#fb923c' },
    { id: 'size', name: 'גודל', icon: Maximize, color: '#34d399' }
  ];

  const playRandom = () => {
    const randomGame = games[Math.floor(Math.random() * games.length)];
    setCurrentView(randomGame.id);
  };

  const handleWin = () => {
    // Increment wins for stickers
    const newWins = wins + 1;
    setWins(newWins);
    localStorage.setItem('unicornWins', newWins.toString());

    // Find current index and move to next game
    const currentIndex = games.findIndex(g => g.id === currentView);
    if (currentIndex !== -1) {
      const nextGame = games[(currentIndex + 1) % games.length];
      setCurrentView(nextGame.id);
    } else {
      setCurrentView('hub');
    }
  };

  if (currentView !== 'hub') {
    return (
      <div className="game-container">
        <div className="top-bar">
          <HoldButton onComplete={() => setCurrentView('hub')} className="back-button">
            חזור (החזק)
          </HoldButton>
        </div>
        <div className="game-content">
          {currentView === 'stickers' && <StickerBook wins={wins} onClose={() => setCurrentView('hub')} />}
          {currentView === 'matching' && <MatchingGame onWin={handleWin} />}
          {currentView === 'maze' && <MazeGame onWin={handleWin} />}
          {currentView === 'tracing' && <TracingGame onWin={handleWin} />}
          {currentView === 'counting' && <CountingGame onWin={handleWin} />}
          {currentView === 'puzzle' && <PuzzleGame onWin={handleWin} />}
          {currentView === 'sorting' && <SortingGame onWin={handleWin} />}
          {currentView === 'memory' && <MemoryGame onWin={handleWin} />}
          {currentView === 'identify' && <IdentifyGame onWin={handleWin} />}
          {currentView === 'coloring' && <ColoringGame onWin={handleWin} />}
          {currentView === 'size' && <SizeGame onWin={handleWin} />}
        </div>
      </div>
    );
  }

  const toggleMusic = () => {
    if (musicPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.log("Audio play blocked", e));
    }
    setMusicPlaying(!musicPlaying);
  };

  return (
    <div className="hub-container">
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-kids-114751.mp3" />
      
      <div className="hero-section">
        <button className="music-toggle-btn" onClick={toggleMusic} aria-label="Toggle Music">
          {musicPlaying ? <Music size={24} /> : <Music2 size={24} color="#ccc" />}
        </button>

        <div className="unicorn-mascot">🦄</div>
        <h1>משחק הקסם שלי</h1>
        
        <div className="hub-actions">
          <button className="play-random-btn" onClick={playRandom}>
            <Sparkles className="inline-icon" />
            שחקי עכשיו!
            <Sparkles className="inline-icon" />
          </button>
          
          <button className="sticker-book-btn" onClick={() => setCurrentView('stickers')}>
            <Star className="inline-icon" />
            אלבום המדבקות
          </button>
        </div>
      </div>

      <div className="games-grid">
        {games.map(game => {
          const Icon = game.icon;
          return (
            <button 
              key={game.id} 
              className="game-card"
              style={{ backgroundColor: game.color }}
              onClick={() => setCurrentView(game.id)}
            >
              <Icon size={48} />
              <h2>{game.name}</h2>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default App;
