import { useState } from 'react';
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
import { Sparkles, Route, Shapes, PenTool, Hash, Puzzle, Combine, Grip, Search } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('hub');

  const games = [
    { id: 'matching', name: 'התאמה', icon: Shapes, color: '#fbcfe8' },
    { id: 'maze', name: 'מבוך', icon: Route, color: '#e9d5ff' },
    { id: 'tracing', name: 'כתיבה', icon: PenTool, color: '#c084fc' },
    { id: 'counting', name: 'ספירה', icon: Hash, color: '#fde047' },
    { id: 'puzzle', name: 'פאזל', icon: Puzzle, color: '#86efac' },
    { id: 'sorting', name: 'מיון', icon: Combine, color: '#93c5fd' },
    { id: 'memory', name: 'זיכרון', icon: Grip, color: '#fca5a5' },
    { id: 'identify', name: 'זיהוי', icon: Search, color: '#fcd34d' }
  ];

  const playRandom = () => {
    const randomGame = games[Math.floor(Math.random() * games.length)];
    setCurrentView(randomGame.id);
  };

  const handleWin = () => {
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
          {currentView === 'matching' && <MatchingGame onWin={handleWin} />}
          {currentView === 'maze' && <MazeGame onWin={handleWin} />}
          {currentView === 'tracing' && <TracingGame onWin={handleWin} />}
          {currentView === 'counting' && <CountingGame onWin={handleWin} />}
          {currentView === 'puzzle' && <PuzzleGame onWin={handleWin} />}
          {currentView === 'sorting' && <SortingGame onWin={handleWin} />}
          {currentView === 'memory' && <MemoryGame onWin={handleWin} />}
          {currentView === 'identify' && <IdentifyGame onWin={handleWin} />}
          {currentView !== 'matching' && currentView !== 'maze' && currentView !== 'tracing' && currentView !== 'counting' && currentView !== 'puzzle' && currentView !== 'sorting' && currentView !== 'memory' && currentView !== 'identify' && (
            <>
              <h1>{games.find(g => g.id === currentView)?.name}</h1>
              <p>המשחק בבניה!</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="hub-container">
      <div className="hero-section">
        <div className="unicorn-mascot">🦄</div>
        <h1>משחק הקסם שלי</h1>
        <button className="play-random-btn" onClick={playRandom}>
          <Sparkles className="inline-icon" />
          שחקי עכשיו!
          <Sparkles className="inline-icon" />
        </button>
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
