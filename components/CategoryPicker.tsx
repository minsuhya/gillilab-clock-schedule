import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CategoryType } from '@/types';
import { getTranslatedCategories } from '@/utils/categoryUtils';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/constants/Theme';

interface CategoryPickerProps {
  selectedCategory: CategoryType;
  onSelect: (category: CategoryType) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  selectedCategory,
  onSelect,
}) => {
  const { t } = useTranslation('categories');
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const categories = getTranslatedCategories();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('category', { ns: 'common' })}</Text>
      <View style={styles.categories}>
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: isSelected ? category.color : `${category.color}15`,
                  borderColor: category.color,
                  borderWidth: 2,
                },
              ]}
              onPress={() => onSelect(category.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryName,
                  { color: isSelected ? '#FFFFFF' : category.color },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create<{
  container: ViewStyle;
  label: TextStyle;
  categories: ViewStyle;
  categoryButton: ViewStyle;
  categoryIcon: TextStyle;
  categoryName: TextStyle;
}>({
  container: {
    marginVertical: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.xs,
  },
  categoryIcon: {
    fontSize: theme.typography.fontSize.lg,
  },
  categoryName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold as any,
  },
});
