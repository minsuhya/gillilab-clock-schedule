import { CategoryType } from '@/types';
import { DEFAULT_CATEGORIES } from '@/constants/Categories';

export function getCategoryColor(category: CategoryType): string {
  const cat = DEFAULT_CATEGORIES.find(c => c.id === category);
  return cat?.color || '#3B82F6';
}

export function getCategoryName(category: CategoryType): string {
  const cat = DEFAULT_CATEGORIES.find(c => c.id === category);
  return cat?.name || '업무';
}

export function getCategoryIcon(category: CategoryType): string {
  const cat = DEFAULT_CATEGORIES.find(c => c.id === category);
  return cat?.icon || '💼';
}

export function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
