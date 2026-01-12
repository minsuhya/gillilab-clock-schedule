import { DEFAULT_CATEGORIES } from '@/constants/Categories';
import { Category, CategoryType } from '@/types';
import i18n from '@/i18n/config';

export const getTranslatedCategories = (): Category[] => {
  return DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    name: i18n.t(`categories:${cat.id}`),
  }));
};

export const getCategoryName = (categoryId: CategoryType): string => {
  return i18n.t(`categories:${categoryId}`);
};
