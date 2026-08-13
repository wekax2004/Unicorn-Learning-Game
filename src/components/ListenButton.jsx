import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import './ListenButton.css';

export default function ListenButton({ text }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    if (!('speechSynthesis' in window)) {
      alert("הדפדפן שלך אינו תומך בהקראת טקסט.");
      return;
    }

    // Cancel previous speech to prevent queue build-up
    window.speechSynthesis.cancel();

    setTimeout(() => {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'he-IL';

      // Explicitly find and assign a Hebrew voice (helps on Windows PC / Chrome)
      const voices = window.speechSynthesis.getVoices();
      const hebrewVoice = voices.find(v => v.lang.includes('he') || v.lang.includes('HE') || v.lang.includes('iw'));
      if (hebrewVoice) {
        msg.voice = hebrewVoice;
      }
      
      window.currentUtterance = msg;
      
      msg.onstart = () => setIsPlaying(true);
      msg.onend = () => setIsPlaying(false);
      msg.onerror = (err) => {
        console.error('Speech synthesis error:', err);
        setIsPlaying(false);
      };
      
      window.speechSynthesis.speak(msg);
      
      setTimeout(() => {
        if (!window.speechSynthesis.speaking) {
          setIsPlaying(false);
          console.warn("Speech didn't start. Check device mute switch or Hebrew voice settings.");
        }
      }, 1000);
    }, 50);
  };

  // Ensure voices are loaded ahead of time
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

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
