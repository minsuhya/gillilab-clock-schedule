import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Schedule } from '@/types';
import { getCategoryName } from '@/utils/categoryUtils';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/constants/Theme';

interface EventItemProps {
  schedule: Schedule;
  onPress: () => void;
}

export const EventItem: React.FC<EventItemProps> = ({ schedule, onPress }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const categoryName = getCategoryName(schedule.category);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.colorIndicator, { backgroundColor: schedule.color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{schedule.title}</Text>
          {schedule.notificationEnabled && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationIcon}>🔔</Text>
            </View>
          )}
        </View>
        <View style={styles.timeRow}>
          <View style={styles.timeChip}>
            <Text style={styles.timeText}>{schedule.startTime}</Text>
          </View>
          <Text style={styles.timeSeparator}>→</Text>
          <View style={styles.timeChip}>
            <Text style={styles.timeText}>{schedule.endTime}</Text>
          </View>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: `${schedule.color}15` }]}>
          <View style={[styles.categoryDot, { backgroundColor: schedule.color }]} />
          <Text style={[styles.categoryText, { color: schedule.color }]}>{categoryName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create<{
  container: ViewStyle;
  colorIndicator: ViewStyle;
  content: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  notificationBadge: ViewStyle;
  notificationIcon: TextStyle;
  timeRow: ViewStyle;
  timeChip: ViewStyle;
  timeText: TextStyle;
  timeSeparator: TextStyle;
  categoryBadge: ViewStyle;
  categoryDot: ViewStyle;
  categoryText: TextStyle;
}>({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorIndicator: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    flex: 1,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.primary,
  },
  notificationBadge: {
    marginLeft: theme.spacing.sm,
    backgroundColor: theme.colors.background.tertiary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  notificationIcon: {
    fontSize: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  timeChip: {
    backgroundColor: theme.colors.background.tertiary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  timeText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold as any,
    color: theme.colors.text.secondary,
    fontFamily: 'monospace',
  },
  timeSeparator: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.tertiary,
    marginHorizontal: theme.spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.xs,
  },
  categoryText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold as any,
    textTransform: 'capitalize',
  },
});
