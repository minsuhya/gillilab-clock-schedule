import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Schedule } from '@/types';
import { EventItem } from './EventItem';
import { sortSchedulesByTime } from '@/utils/scheduleUtils';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/constants/Theme';

interface EventListProps {
  schedules: Schedule[];
  onEventPress: (schedule: Schedule) => void;
}

export const EventList: React.FC<EventListProps> = ({ schedules, onEventPress }) => {
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const sortedSchedules = sortSchedulesByTime(schedules);

  const renderItem = ({ item }: { item: Schedule }) => (
    <EventItem schedule={item} onPress={() => onEventPress(item)} />
  );

  if (schedules.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📅</Text>
        <Text style={styles.emptyText}>{t('schedule.noSchedules')}</Text>
        <Text style={styles.emptySubtext}>{t('schedule.createFirstSchedule')}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={sortedSchedules}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const createStyles = (theme: Theme) => StyleSheet.create<{
  listContainer: ViewStyle;
  emptyContainer: ViewStyle;
  emptyIcon: TextStyle;
  emptyText: TextStyle;
  emptySubtext: TextStyle;
}>({
  listContainer: {
    paddingVertical: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xxxl,
    paddingVertical: theme.spacing.xxxl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
});
