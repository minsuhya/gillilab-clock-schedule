import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Schedule } from '@/types';
import { DESIGN_SYSTEM } from '@/constants/Design';

interface CurrentScheduleCardProps {
  schedule: Schedule | null;
}

export const CurrentScheduleCard: React.FC<CurrentScheduleCardProps> = ({ schedule }) => {
  if (!schedule) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>✨</Text>
          <Text style={styles.emptyText}>현재 진행 중인 일정이 없습니다</Text>
          <Text style={styles.emptySubtext}>자유 시간을 즐기세요!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.card, { borderColor: schedule.color }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.badge, { backgroundColor: schedule.color }]}>
            <View style={styles.pulseOuter} />
            <View style={styles.pulseInner} />
            <Text style={styles.badgeText}>진행 중</Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={2}>{schedule.title}</Text>
        <View style={styles.timeRow}>
          <View style={styles.timeChip}>
            <Text style={styles.timeLabel}>시작</Text>
            <Text style={styles.timeValue}>{schedule.startTime}</Text>
          </View>
          <View style={styles.timeDivider} />
          <View style={styles.timeChip}>
            <Text style={styles.timeLabel}>종료</Text>
            <Text style={styles.timeValue}>{schedule.endTime}</Text>
          </View>
        </View>
        <View style={[styles.categoryChip, { backgroundColor: `${schedule.color}15` }]}>
          <Text style={[styles.categoryText, { color: schedule.color }]}>{schedule.category}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: DESIGN_SYSTEM.spacing.xl,
    paddingTop: DESIGN_SYSTEM.spacing.lg,
    paddingBottom: DESIGN_SYSTEM.spacing.md,
  },
  card: {
    backgroundColor: DESIGN_SYSTEM.colors.background.secondary,
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    padding: DESIGN_SYSTEM.spacing.xl,
    borderWidth: 2,
    ...DESIGN_SYSTEM.shadows.lg,
  },
  emptyCard: {
    backgroundColor: DESIGN_SYSTEM.colors.background.tertiary,
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    padding: DESIGN_SYSTEM.spacing.xxl,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },
  emptyText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.md,
    color: DESIGN_SYSTEM.colors.text.secondary,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
    marginBottom: DESIGN_SYSTEM.spacing.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    color: DESIGN_SYSTEM.colors.text.tertiary,
    textAlign: 'center',
  },
  cardHeader: {
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: DESIGN_SYSTEM.spacing.md,
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    position: 'relative',
  },
  pulseOuter: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  pulseInner: {
    width: 8,
    height: 8,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    backgroundColor: DESIGN_SYSTEM.colors.text.inverse,
    marginRight: DESIGN_SYSTEM.spacing.sm,
  },
  badgeText: {
    color: DESIGN_SYSTEM.colors.text.inverse,
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
  },
  title: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xxl,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.extrabold,
    color: DESIGN_SYSTEM.colors.text.primary,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    lineHeight: 32,
  },
  timeRow: {
    flexDirection: 'row',
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },
  timeChip: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.background.tertiary,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    padding: DESIGN_SYSTEM.spacing.md,
  },
  timeDivider: {
    width: DESIGN_SYSTEM.spacing.md,
  },
  timeLabel: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xs,
    color: DESIGN_SYSTEM.colors.text.tertiary,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.lg,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
    color: DESIGN_SYSTEM.colors.text.primary,
    fontFamily: 'monospace',
  },
  categoryChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: DESIGN_SYSTEM.spacing.md,
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
  },
  categoryText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
    textTransform: 'capitalize',
  },
});
