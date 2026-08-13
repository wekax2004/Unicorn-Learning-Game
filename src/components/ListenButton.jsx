import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import './ListenButton.css';

export default function ListenButton({ text }) {
  const [isPlaying, setIsPlaying] = useState(false);

const AUDIO_MAP = {
  "ברוכה הבאה למשחק הקסם שלי!": "welcome",
  "התאימי את הצורה לצללית שלה": "match_shape",
  "עזרי לחד-קרן להגיע לכוכב, והיזהרי מהקירות!": "maze",
  "כתבי את האותיות": "tracing",
  "ספרי את הפריטים ובחרי את המספר הנכון": "counting",
  "התאימי את הגדול לסל הגדול, והקטן לסל הקטן": "size",
  "גררי את החלקים למקום הנכון להשלמת התמונה": "puzzle_drag",
  "בחרי רמת קושי לפאזל": "puzzle_diff",
  "מצאי את כל הזוגות": "memory",
  "מצאי את הפריט המבוקש": "identify",
  "בחרי צבע וצבעי את הציור!": "coloring",
  "ברוכה הבאה לאלבום המדבקות שלך!": "sticker"
};

  const speak = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    if (isPlaying) return;

    // 1. Check if we have a pre-recorded MP3 for this text
    if (AUDIO_MAP[text]) {
      const audioUrl = `/Unicorn-Learning-Game/audio/${AUDIO_MAP[text]}.mp3`;
      const audio = new Audio(audioUrl);
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        playNative(); // Fallback if file fails to load
      };
      
      audio.play().catch(err => {
        console.warn("Audio play failed, falling back to native.", err);
        setIsPlaying(false);
        playNative();
      });
      return;
    }

    // 2. If no MP3 exists, use native SpeechSynthesis
    playNative();
  };

  const playNative = () => {
    if (!('speechSynthesis' in window)) {
      console.warn("Speech synthesis not supported.");
      return;
    }
    
    const voices = window.speechSynthesis.getVoices();
    const hebrewVoice = voices.find(v => v.lang.includes('he') || v.lang.includes('HE') || v.lang.includes('iw'));

    window.speechSynthesis.cancel();
    
    setTimeout(() => {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'he-IL';
      if (hebrewVoice) msg.voice = hebrewVoice;
      
      window.currentUtterance = msg;
      
      msg.onstart = () => setIsPlaying(true);
      msg.onend = () => setIsPlaying(false);
      msg.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(msg);
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
