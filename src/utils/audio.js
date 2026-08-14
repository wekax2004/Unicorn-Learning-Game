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

const ANIMAL_SOUND_URLS = {
  'a1': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_a16bc0b12e.mp3?filename=dog-barking-70772.mp3', // Dog
  'a2': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_24a1b0b5be.mp3?filename=cat-meow-14536.mp3', // Cat
  'a6': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_494e5e4069.mp3?filename=lion-roar-6011.mp3', // Lion
  'a9': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_d06f69fc35.mp3?filename=cow-moo-114519.mp3', // Cow
  'a10': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_55a297e555.mp3?filename=horse-neigh-71322.mp3', // Horse
  'a11': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_13a17e0b57.mp3?filename=sheep-122256.mp3', // Sheep
  'a12': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_cfd0fc9d5d.mp3?filename=rooster-crowing-70252.mp3', // Chicken
  'a16': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_54cbcf1d2d.mp3?filename=elephant-trumpets-71819.mp3', // Elephant
};

export const playAnimalSound = (animalId) => {
  if (ANIMAL_SOUND_URLS[animalId]) {
    try {
      const audio = new Audio(ANIMAL_SOUND_URLS[animalId]);
      audio.play().catch(() => playPop());
    } catch {
      playPop();
    }
  } else {
    playPop();
  }
};
