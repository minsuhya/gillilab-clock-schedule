import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Schedule } from '@/types';
import { DESIGN_SYSTEM } from '@/constants/Design';

interface EventItemProps {
  schedule: Schedule;
  onPress: () => void;
}

export const EventItem: React.FC<EventItemProps> = ({ schedule, onPress }) => {
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
          <Text style={[styles.categoryText, { color: schedule.color }]}>{schedule.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: DESIGN_SYSTEM.colors.background.secondary,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    marginHorizontal: DESIGN_SYSTEM.spacing.lg,
    marginVertical: DESIGN_SYSTEM.spacing.sm,
    overflow: 'hidden',
    ...DESIGN_SYSTEM.shadows.md,
  },
  colorIndicator: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: DESIGN_SYSTEM.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },
  title: {
    flex: 1,
    fontSize: DESIGN_SYSTEM.typography.fontSize.lg,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
    color: DESIGN_SYSTEM.colors.text.primary,
  },
  notificationBadge: {
    marginLeft: DESIGN_SYSTEM.spacing.sm,
    backgroundColor: DESIGN_SYSTEM.colors.background.tertiary,
    paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
    paddingVertical: 4,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm,
  },
  notificationIcon: {
    fontSize: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },
  timeChip: {
    backgroundColor: DESIGN_SYSTEM.colors.background.tertiary,
    paddingHorizontal: DESIGN_SYSTEM.spacing.md,
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm,
  },
  timeText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
    color: DESIGN_SYSTEM.colors.text.secondary,
    fontFamily: 'monospace',
  },
  timeSeparator: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.md,
    color: DESIGN_SYSTEM.colors.text.tertiary,
    marginHorizontal: DESIGN_SYSTEM.spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: DESIGN_SYSTEM.spacing.md,
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    marginRight: DESIGN_SYSTEM.spacing.xs,
  },
  categoryText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xs,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
    textTransform: 'capitalize',
  },
});
