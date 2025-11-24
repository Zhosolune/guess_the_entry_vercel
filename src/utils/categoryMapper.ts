export const ACTUAL_CATEGORIES = [
  '自然',
  '天文',
  '地理',
  '动漫',
  '影视',
  '游戏',
  '体育',
  '历史',
  'ACGN'
] as const;

export type ActualGameCategory = typeof ACTUAL_CATEGORIES[number];

export function toEnglishKey(category: string): string {
  const s = String(category).toLowerCase();
  switch (s) {
    case '自然': return 'nature';
    case '天文': return 'astronomy';
    case '地理': return 'geography';
    case '动漫': return 'anime';
    case '影视': return 'movie';
    case '游戏': return 'game';
    case '体育': return 'sports';
    case '历史': return 'history';
    case 'acgn': return 'acgn';
    default: return s;
  }
}

export function toChineseName(key: string): string {
  const s = String(key).toLowerCase();
  switch (s) {
    case 'nature': return '自然';
    case 'astronomy': return '天文';
    case 'geography': return '地理';
    case 'anime': return '动漫';
    case 'movie': return '影视';
    case 'game': return '游戏';
    case 'sports': return '体育';
    case 'history': return '历史';
    case 'acgn': return 'ACGN';
    default: return key;
  }
}

export function selectRandomCategory(): ActualGameCategory {
  const idx = Math.floor(Math.random() * ACTUAL_CATEGORIES.length);
  return ACTUAL_CATEGORIES[idx];
}

export function isActualCategory(category: string): boolean {
  return ACTUAL_CATEGORIES.includes(category as ActualGameCategory);
}
