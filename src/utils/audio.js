// Simple Web Audio API Synthesizer so we don't need external files

const getAudioContext = () => {
  if (!window.audioCtx) {
    window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return window.audioCtx;
};

export const playPop = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    
    // Quick pop sound
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.warn("Audio play failed", e);
  }
};

export const playSuccess = () => {
  try {
    const ctx = getAudioContext();
    
    const playNote = (freq, time, duration) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.3, time + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + duration);
    };

    const now = ctx.currentTime;
    // C Major Arpeggio chime
    playNote(523.25, now, 0.5); // C5
    playNote(659.25, now + 0.1, 0.5); // E5
    playNote(783.99, now + 0.2, 0.5); // G5
    playNote(1046.50, now + 0.3, 1.0); // C6
  } catch (e) {
    console.warn("Audio play failed", e);
  }
};
