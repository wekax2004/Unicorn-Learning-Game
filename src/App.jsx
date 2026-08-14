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
import { fireConfetti } from './utils/confetti';
import { Sparkles, Route, Shapes, PenTool, Hash, Puzzle, Combine, Grip, Search, Star, Music, Music2, Palette, Maximize, Settings, X } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('hub');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const audioRef = useRef(null);

  // Theme & Personalization
  const [theme, setTheme] = useState(() => localStorage.getItem('unicornTheme') || 'unicorn');
  const [childName, setChildName] = useState(() => localStorage.getItem('childName') || '');

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('unicornTheme', theme);
  }, [theme]);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setChildName(newName);
    localStorage.setItem('childName', newName);
  };
  
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
    fireConfetti();
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
      
      <div className="hero-section" style={{ flex: 1, justifyContent: 'center', margin: 0 }}>
        <button className="music-toggle-btn" onClick={toggleMusic} aria-label="Toggle Music">
          {musicPlaying ? <Music size={24} /> : <Music2 size={24} color="#ccc" />}
        </button>
        
        <div className="settings-btn" style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
          <HoldButton onComplete={() => setShowMenu(true)} className="music-toggle-btn" style={{ position: 'relative', top: 0, left: 0, padding: 0 }}>
            <Settings size={24} color="#64748b" />
          </HoldButton>
        </div>

        <div className="unicorn-mascot">{theme === 'dino' ? '🦖' : '🦄'}</div>
        <h1>{childName ? `המשחק של ${childName}` : 'משחק הקסם שלי'}</h1>
        
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

      {showMenu && (
        <div className="menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="menu-modal" onClick={e => e.stopPropagation()}>
            <button className="close-menu-btn" onClick={() => setShowMenu(false)}>
              <X size={24} />
            </button>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>תפריט הורים</h2>
            
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '15px', marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>הגדרות אישיות</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 'bold' }}>
                  שם הילד/ה (לא חובה):
                  <input 
                    type="text" 
                    value={childName} 
                    onChange={handleNameChange}
                    placeholder="למשל: נועה"
                    style={{ padding: '0.8rem', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '1.2rem' }}
                  />
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 'bold' }}>
                  נושא המשחק:
                  <button 
                    onClick={() => setTheme(theme === 'unicorn' ? 'dino' : 'unicorn')}
                    style={{ padding: '0.5rem 1rem', fontSize: '1rem', flex: 1, backgroundColor: 'white', border: '2px solid var(--accent)' }}
                  >
                    {theme === 'unicorn' ? '🦄 חד-קרן ורוד' : '🦖 דינוזאור ירוק'}
                  </button>
                </label>
              </div>
            </div>

            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>בחירת משחק ספציפי</h3>
            <div className="games-grid">
              {games.map(game => {
                const Icon = game.icon;
                return (
                  <button 
                    key={game.id} 
                    className="game-card"
                    style={{ backgroundColor: game.color }}
                    onClick={() => {
                      setCurrentView(game.id);
                      setShowMenu(false);
                    }}
                  >
                    <Icon size={48} />
                    <h2>{game.name}</h2>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
