import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { Schedule } from '@/types';
import { EventItem } from './EventItem';
import { sortSchedulesByTime } from '@/utils/scheduleUtils';
import { DESIGN_SYSTEM } from '@/constants/Design';

interface EventListProps {
  schedules: Schedule[];
  onEventPress: (schedule: Schedule) => void;
}

export const EventList: React.FC<EventListProps> = ({ schedules, onEventPress }) => {
  const sortedSchedules = sortSchedulesByTime(schedules);

  const renderItem = ({ item }: { item: Schedule }) => (
    <EventItem schedule={item} onPress={() => onEventPress(item)} />
  );

  if (schedules.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📅</Text>
        <Text style={styles.emptyText}>등록된 일정이 없습니다</Text>
        <Text style={styles.emptySubtext}>+ 버튼을 눌러 첫 일정을 만들어보세요</Text>
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

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    paddingBottom: DESIGN_SYSTEM.spacing.xxxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DESIGN_SYSTEM.spacing.xxxl,
    paddingVertical: DESIGN_SYSTEM.spacing.xxxl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
  },
  emptyText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xl,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
    color: DESIGN_SYSTEM.colors.text.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.md,
    color: DESIGN_SYSTEM.colors.text.tertiary,
    textAlign: 'center',
  },
});
