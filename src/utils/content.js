export const HEBREW_LETTERS = [
  'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י',
  'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר',
  'ש', 'ת'
];

export const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

// Simple color mappings for backgrounds or sorting
export const COLORS = {
  red: '#fca5a5',
  green: '#86efac',
  yellow: '#fde047',
  blue: '#93c5fd',
  purple: '#d8b4fe',
  orange: '#fdba74'
};

export const FRUITS_VEGGIES = [
  { id: 'f1', name: 'תפוח', icon: '🍎', color: 'red', type: 'fruit' },
  { id: 'f2', name: 'תות', icon: '🍓', color: 'red', type: 'fruit' },
  { id: 'f3', name: 'בננה', icon: '🍌', color: 'yellow', type: 'fruit' },
  { id: 'f4', name: 'לימון', icon: '🍋', color: 'yellow', type: 'fruit' },
  { id: 'f5', name: 'מלפפון', icon: '🥒', color: 'green', type: 'veg' },
  { id: 'f6', name: 'ברוקולי', icon: '🥦', color: 'green', type: 'veg' },
  { id: 'f7', name: 'ענבים', icon: '🍇', color: 'purple', type: 'fruit' },
  { id: 'f8', name: 'חציל', icon: '🍆', color: 'purple', type: 'veg' },
  { id: 'f9', name: 'אבטיח', icon: '🍉', color: 'red', type: 'fruit' },
  { id: 'f10', name: 'תפוז', icon: '🍊', color: 'orange', type: 'fruit' },
  { id: 'f11', name: 'גזר', icon: '🥕', color: 'orange', type: 'veg' },
  { id: 'f12', name: 'עגבניה', icon: '🍅', color: 'red', type: 'veg' },
  { id: 'f13', name: 'תירס', icon: '🌽', color: 'yellow', type: 'veg' },
  { id: 'f14', name: 'אגס', icon: '🍐', color: 'green', type: 'fruit' },
  { id: 'f15', name: 'דובדבן', icon: '🍒', color: 'red', type: 'fruit' },
  { id: 'f16', name: 'פלפל', icon: '🫑', color: 'green', type: 'veg' }
];

export const ANIMALS = [
  { id: 'a1', name: 'כלב', icon: '🐶', type: 'animal' },
  { id: 'a2', name: 'חתול', icon: '🐱', type: 'animal' },
  { id: 'a3', name: 'ארנב', icon: '🐰', type: 'animal' },
  { id: 'a4', name: 'צפרדע', icon: '🐸', type: 'animal' },
  { id: 'a5', name: 'דובי', icon: '🐻', type: 'animal' },
  { id: 'a6', name: 'אריה', icon: '🦁', type: 'animal' },
  { id: 'a7', name: 'קוף', icon: '🐵', type: 'animal' },
  { id: 'a8', name: 'פינגווין', icon: '🐧', type: 'animal' },
  { id: 'a9', name: 'פרה', icon: '🐮', type: 'animal' },
  { id: 'a10', name: 'סוס', icon: '🐴', type: 'animal' },
  { id: 'a11', name: 'כבשה', icon: '🐑', type: 'animal' },
  { id: 'a12', name: 'תרנגולת', icon: '🐔', type: 'animal' },
  { id: 'a13', name: 'דג', icon: '🐟', type: 'animal' },
  { id: 'a14', name: 'תמנון', icon: '🐙', type: 'animal' },
  { id: 'a15', name: 'דולפין', icon: '🐬', type: 'animal' },
  { id: 'a16', name: 'פיל', icon: '🐘', type: 'animal' },
  { id: 'a17', name: 'נמר', icon: '🐯', type: 'animal' },
  { id: 'a18', name: 'צב', icon: '🐢', type: 'animal' }
];

export const SHAPES = [
  { id: 's1', name: 'עיגול', icon: '🔴', type: 'shape' },
  { id: 's2', name: 'ריבוע', icon: '🟦', type: 'shape' },
  { id: 's3', name: 'משולש', icon: '🔺', type: 'shape' },
  { id: 's4', name: 'כוכב', icon: '⭐', type: 'shape' },
  { id: 's5', name: 'לב', icon: '❤️', type: 'shape' }
];

export const VEHICLES = [
  { id: 'v1', name: 'מכונית', icon: '🚗', type: 'vehicle' },
  { id: 'v2', name: 'אוטובוס', icon: '🚌', type: 'vehicle' },
  { id: 'v3', name: 'רכבת', icon: '🚂', type: 'vehicle' },
  { id: 'v4', name: 'מטוס', icon: '✈️', type: 'vehicle' },
  { id: 'v5', name: 'ספינה', icon: '🚢', type: 'vehicle' },
  { id: 'v6', name: 'אופניים', icon: '🚲', type: 'vehicle' },
  { id: 'v7', name: 'משאית', icon: '🚚', type: 'vehicle' },
  { id: 'v8', name: 'טרקטור', icon: '🚜', type: 'vehicle' }
];

// Master list for identification game
export const ALL_OBJECTS = [...FRUITS_VEGGIES, ...ANIMALS, ...SHAPES, ...VEHICLES];

export function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export const ALL_STICKERS = [
  '🦄', '🦋', '🌈', '👑', '⭐', '🎈', '🍭', '🎀', '🌸', '💖', 
  '🍓', '🐬', '🐥', '🐰', '🧜‍♀️', '🏰', '🎨', '🧁', '🍦', '🎁'
];
