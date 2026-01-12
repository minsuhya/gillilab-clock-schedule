import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { EventList } from '@/components/EventList';
import { useScheduleStore } from '@/store/scheduleStore';
import { DESIGN_SYSTEM } from '@/constants/Design';

export default function ListScreen() {
  const router = useRouter();
  const schedules = useScheduleStore((state) => state.schedules);

  const handleEventPress = (schedule: any) => {
    router.push({
      pathname: '/modal',
      params: { scheduleId: schedule.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>전체</Text>
          <Text style={styles.title}>일정 목록</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{schedules.length}</Text>
          <Text style={styles.countLabel}>개</Text>
        </View>
      </View>
      <EventList schedules={schedules} onEventPress={handleEventPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: DESIGN_SYSTEM.spacing.md,
    paddingHorizontal: DESIGN_SYSTEM.spacing.xl,
    paddingBottom: DESIGN_SYSTEM.spacing.lg,
    backgroundColor: DESIGN_SYSTEM.colors.background.secondary,
  },
  subtitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    color: DESIGN_SYSTEM.colors.text.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.xs,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
  },
  title: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.display,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.extrabold,
    color: DESIGN_SYSTEM.colors.text.primary,
    letterSpacing: -0.5,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: DESIGN_SYSTEM.colors.accent.indigo,
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    ...DESIGN_SYSTEM.shadows.sm,
  },
  countText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xxl,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
    color: DESIGN_SYSTEM.colors.text.inverse,
  },
  countLabel: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 2,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
  },
});
