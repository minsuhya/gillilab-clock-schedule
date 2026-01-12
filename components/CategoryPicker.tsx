import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CategoryType } from '@/types';
import { DEFAULT_CATEGORIES } from '@/constants/Categories';
import { DESIGN_SYSTEM } from '@/constants/Design';

interface CategoryPickerProps {
  selectedCategory: CategoryType;
  onSelect: (category: CategoryType) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  selectedCategory,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>카테고리</Text>
      <View style={styles.categories}>
        {DEFAULT_CATEGORIES.map((category) => {
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

const styles = StyleSheet.create({
  container: {
    marginVertical: DESIGN_SYSTEM.spacing.md,
  },
  label: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.md,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
    color: DESIGN_SYSTEM.colors.text.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DESIGN_SYSTEM.spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    paddingHorizontal: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    gap: DESIGN_SYSTEM.spacing.xs,
  },
  categoryIcon: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.lg,
  },
  categoryName: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
  },
});
