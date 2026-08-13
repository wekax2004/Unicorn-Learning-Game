import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import './ListenButton.css';

export default function ListenButton({ text }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    if (isPlaying) return;

    try {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=he&q=${encodeURIComponent(text)}`;
      const audio = new Audio(url);
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        // Fallback to speechSynthesis if Google TTS fails (or offline)
        if ('speechSynthesis' in window) {
          const msg = new SpeechSynthesisUtterance(text);
          msg.lang = 'he-IL';
          window.speechSynthesis.speak(msg);
        }
      };
      
      audio.play().catch(err => {
        console.error("Audio play failed:", err);
        setIsPlaying(false);
      });
    } catch (err) {
      console.error(err);
      setIsPlaying(false);
    }
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
