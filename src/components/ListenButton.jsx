import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import './ListenButton.css';

export default function ListenButton({ text }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    if (isPlaying) return;

    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    const hebrewVoice = voices.find(v => v.lang.includes('he') || v.lang.includes('HE') || v.lang.includes('iw'));

    // 1. Try Google TTS (Best quality, works on Windows without installed packs)
    try {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=he&q=${encodeURIComponent(text)}`;
      const audio = new Audio(url);
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      
      // If Google TTS fails (iOS blocked, offline, etc)
      audio.onerror = () => {
        setIsPlaying(false);
        playNative(hebrewVoice);
      };
      
      audio.play().catch(err => {
        console.warn("Google TTS blocked, falling back to native.", err);
        setIsPlaying(false);
        playNative(hebrewVoice);
      });
    } catch (err) {
      console.warn("Google TTS failed to init, falling back to native.", err);
      setIsPlaying(false);
      playNative(hebrewVoice);
    }
  };

  const playNative = (hebrewVoice) => {
    if (!('speechSynthesis' in window)) {
      alert("הדפדפן שלך אינו תומך בהקראת טקסט. נסה דפדפן אחר.");
      return;
    }
    
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
      
      setTimeout(() => {
        if (!window.speechSynthesis.speaking) {
          setIsPlaying(false);
          console.warn("Native speech didn't start. Voice might be missing or device is muted.");
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
