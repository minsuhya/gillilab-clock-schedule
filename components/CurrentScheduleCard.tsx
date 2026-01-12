import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Schedule } from '@/types';
import { getCategoryName } from '@/utils/categoryUtils';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/constants/Theme';

interface CurrentScheduleCardProps {
  schedule: Schedule | null;
}

export const CurrentScheduleCard: React.FC<CurrentScheduleCardProps> = ({ schedule }) => {
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!schedule) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>✨</Text>
          <Text style={styles.emptyText}>{t('schedule.noCurrentSchedule')}</Text>
          <Text style={styles.emptySubtext}>{t('app.enjoyFreeTime')}</Text>
        </View>
      </View>
    );
  }

  const categoryName = getCategoryName(schedule.category);

  return (
    <View style={styles.container}>
      <View style={[styles.card, { borderColor: schedule.color }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.badge, { backgroundColor: schedule.color }]}>
            <View style={styles.pulseOuter} />
            <View style={styles.pulseInner} />
            <Text style={styles.badgeText}>{t('schedule.inProgress')}</Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={2}>{schedule.title}</Text>
        <View style={styles.timeRow}>
          <View style={styles.timeChip}>
            <Text style={styles.timeLabel}>{t('form.start')}</Text>
            <Text style={styles.timeValue}>{schedule.startTime}</Text>
          </View>
          <View style={styles.timeDivider} />
          <View style={styles.timeChip}>
            <Text style={styles.timeLabel}>{t('form.end')}</Text>
            <Text style={styles.timeValue}>{schedule.endTime}</Text>
          </View>
        </View>
        <View style={[styles.categoryChip, { backgroundColor: `${schedule.color}15` }]}>
          <Text style={[styles.categoryText, { color: schedule.color }]}>{categoryName}</Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create<{
  container: ViewStyle;
  card: ViewStyle;
  emptyCard: ViewStyle;
  emptyIcon: TextStyle;
  emptyText: TextStyle;
  emptySubtext: TextStyle;
  cardHeader: ViewStyle;
  badge: ViewStyle;
  pulseOuter: ViewStyle;
  pulseInner: ViewStyle;
  badgeText: TextStyle;
  title: TextStyle;
  timeRow: ViewStyle;
  timeChip: ViewStyle;
  timeDivider: ViewStyle;
  timeLabel: TextStyle;
  timeValue: TextStyle;
  categoryChip: ViewStyle;
  categoryText: TextStyle;
}>({
  container: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyCard: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xxl,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.semibold as any,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
  cardHeader: {
    marginBottom: theme.spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    position: 'relative',
  },
  pulseOuter: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  pulseInner: {
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.text.inverse,
    marginRight: theme.spacing.sm,
  },
  badgeText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold as any,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.extrabold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    lineHeight: 32,
  },
  timeRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  timeChip: {
    flex: 1,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  timeDivider: {
    width: theme.spacing.md,
  },
  timeLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.fontWeight.semibold as any,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.primary,
    fontFamily: 'monospace',
  },
  categoryChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  categoryText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold as any,
    textTransform: 'capitalize',
  },
});
