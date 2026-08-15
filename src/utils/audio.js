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
    const now = ctx.currentTime;
    
    // Play a quick, happy, magical chime
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    
    // Quick sweep up
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.5);
    
    // A second higher note that rings out like a bell
    const osc2 = ctx.createOscillator();
    const gainNode2 = ctx.createGain();
    
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1200, now + 0.2);
    
    gainNode2.gain.setValueAtTime(0, now + 0.2);
    gainNode2.gain.linearRampToValueAtTime(0.2, now + 0.25);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    
    osc2.connect(gainNode2);
    gainNode2.connect(ctx.destination);
    
    osc2.start(now + 0.2);
    osc2.stop(now + 0.9);
  } catch (e) {
    console.warn("Audio play failed", e);
  }
};

export const speakHebrew = (text) => {
  if (!window.speechSynthesis) return;
  // Cancel any ongoing speech so it doesn't queue up forever
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'he-IL';
  utterance.rate = 0.9; // Slightly slower for kids
  window.speechSynthesis.speak(utterance);
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
