// Adaptive difficulty system
// Difficulty level stored in localStorage, starts at 0
// Every 3 consecutive wins -> level up
// Every 2 consecutive losses -> level down

export function getDifficultyLevel() {
  const saved = localStorage.getItem('difficultyLevel');
  return saved ? parseInt(saved, 10) : 0;
}

export function setDifficultyLevel(level) {
  const clamped = Math.max(0, Math.min(3, level));
  localStorage.setItem('difficultyLevel', clamped.toString());
  return clamped;
}

export function recordWin() {
  const wins = parseInt(localStorage.getItem('consecutiveWins') || '0', 10) + 1;
  localStorage.setItem('consecutiveWins', wins.toString());
  localStorage.setItem('consecutiveLosses', '0');
  
  if (wins >= 3) {
    localStorage.setItem('consecutiveWins', '0');
    const currentLevel = getDifficultyLevel();
    return setDifficultyLevel(currentLevel + 1);
  }
  return getDifficultyLevel();
}

export function recordLoss() {
  const losses = parseInt(localStorage.getItem('consecutiveLosses') || '0', 10) + 1;
  localStorage.setItem('consecutiveLosses', losses.toString());
  localStorage.setItem('consecutiveWins', '0');
  
  if (losses >= 2) {
    localStorage.setItem('consecutiveLosses', '0');
    const currentLevel = getDifficultyLevel();
    return setDifficultyLevel(currentLevel - 1);
  }
  return getDifficultyLevel();
}

// Get game-specific parameters based on difficulty level
export function getGameParams(gameId) {
  const level = getDifficultyLevel();
  
  const params = {
    memory: { pairs: [2, 4, 6, 8][level] || 2 },
    jigsaw: { cols: level <= 1 ? 2 : 3, rows: level <= 1 ? 2 : 3 },
    maze: { maxSize: level <= 1 ? 4 : 5 },
    counting: { maxCount: [3, 5, 7, 10][level] || 3 },
    pattern: { type: ['ABAB', 'ABAB', 'AABB', 'ABCABC'][level] || 'ABAB' },
  };
  
  return params[gameId] || {};
}
