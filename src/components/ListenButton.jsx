import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import './ListenButton.css';

export default function ListenButton({ text }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = () => {
    if (!('speechSynthesis' in window)) return;
    
    // Create utterance
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'he-IL';
    
    // Safari/Chrome bug: the utterance can be garbage collected before it finishes
    // Storing it on the window object prevents this.
    window.currentUtterance = msg;
    
    msg.onstart = () => setIsPlaying(true);
    msg.onend = () => setIsPlaying(false);
    msg.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(msg);
  };

  return (
    <button 
      className={`listen-button ${isPlaying ? 'playing' : ''}`} 
      onClick={speak} 
      aria-label="האזן"
      type="button"
    >
      <Volume2 size={32} color={isPlaying ? "#c084fc" : "currentColor"} />
    </button>
  );
}
