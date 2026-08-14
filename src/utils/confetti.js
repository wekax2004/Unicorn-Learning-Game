import confetti from 'canvas-confetti';

export const fireConfetti = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#fbcfe8', '#e9d5ff', '#86efac', '#fde047', '#93c5fd']
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#fbcfe8', '#e9d5ff', '#86efac', '#fde047', '#93c5fd']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};

export const fireStickerSparkles = (x, y) => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x, y },
    colors: ['#fef08a', '#fcd34d', '#f59e0b'],
    ticks: 200,
    gravity: 0.5,
    scalar: 1.2,
    shapes: ['star']
  });
};
