import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ClockView } from '@/components/ClockView';
import { CurrentScheduleCard } from '@/components/CurrentScheduleCard';
import { useScheduleStore } from '@/store/scheduleStore';
import { getCurrentTime } from '@/utils/timeUtils';
import { getCurrentSchedule } from '@/utils/scheduleUtils';
import { DESIGN_SYSTEM } from '@/constants/Design';

export default function ClockScreen() {
  const router = useRouter();
  const schedules = useScheduleStore((state) => state.schedules);
  const [currentTime, setCurrentTime] = useState(getCurrentTime);
  const currentSchedule = getCurrentSchedule(schedules, currentTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEventPress = (schedule: any) => {
    router.push({
      pathname: '/modal',
      params: { scheduleId: schedule.id },
    });
  };

  const handleAddSchedule = () => {
    router.push('/modal');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>안녕하세요 👋</Text>
              <Text style={styles.title}>ClockPlan</Text>
            </View>
            <View style={styles.timeCard}>
              <Text style={styles.timeLabel}>현재 시간</Text>
              <Text style={styles.timeValue}>{currentTime}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <CurrentScheduleCard schedule={currentSchedule} />

          <View style={styles.clockSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>오늘의 일정</Text>
              <View style={styles.scheduleCount}>
                <Text style={styles.scheduleCountText}>{schedules.length}</Text>
              </View>
            </View>
            
            <View style={styles.clockContainer}>
              <ClockView
                schedules={schedules}
                onEventPress={handleEventPress}
                onClockPress={handleAddSchedule}
                currentScheduleId={currentSchedule?.id}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={handleAddSchedule}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: DESIGN_SYSTEM.spacing.md,
    paddingHorizontal: DESIGN_SYSTEM.spacing.xl,
    paddingBottom: DESIGN_SYSTEM.spacing.lg,
    backgroundColor: DESIGN_SYSTEM.colors.background.secondary,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.md,
    color: DESIGN_SYSTEM.colors.text.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.xs,
  },
  title: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.display,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.extrabold,
    color: DESIGN_SYSTEM.colors.text.primary,
    letterSpacing: -0.5,
  },
  timeCard: {
    backgroundColor: DESIGN_SYSTEM.colors.accent.indigo,
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    alignItems: 'center',
    ...DESIGN_SYSTEM.shadows.md,
  },
  timeLabel: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
    marginBottom: 2,
  },
  timeValue: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xl,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
    color: DESIGN_SYSTEM.colors.text.inverse,
    fontFamily: 'monospace',
  },
  content: {
    flex: 1,
  },
  clockSection: {
    paddingTop: DESIGN_SYSTEM.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DESIGN_SYSTEM.spacing.xl,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
  },
  sectionTitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xxl,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
    color: DESIGN_SYSTEM.colors.text.primary,
  },
  scheduleCount: {
    backgroundColor: DESIGN_SYSTEM.colors.accent.indigo,
    width: 32,
    height: 32,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleCountText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
    color: DESIGN_SYSTEM.colors.text.inverse,
  },
  clockContainer: {
    alignItems: 'center',
  },
  fabContainer: {
    position: 'absolute',
    right: DESIGN_SYSTEM.spacing.xl,
    bottom: DESIGN_SYSTEM.spacing.xxxl,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    backgroundColor: DESIGN_SYSTEM.colors.accent.indigo,
    alignItems: 'center',
    justifyContent: 'center',
    ...DESIGN_SYSTEM.shadows.lg,
  },
  fabIcon: {
    fontSize: 32,
    color: DESIGN_SYSTEM.colors.text.inverse,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.normal,
    lineHeight: 32,
  },
});
