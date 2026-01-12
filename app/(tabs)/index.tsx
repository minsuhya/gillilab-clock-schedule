import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ClockView } from '@/components/ClockView';
import { CurrentScheduleCard } from '@/components/CurrentScheduleCard';
import { useScheduleStore } from '@/store/scheduleStore';
import { getCurrentTime } from '@/utils/timeUtils';
import { getCurrentSchedule } from '@/utils/scheduleUtils';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/constants/Theme';

export default function ClockScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation('common');
  const schedules = useScheduleStore((state) => state.schedules);
  const [currentTime, setCurrentTime] = useState(getCurrentTime);
  const currentSchedule = getCurrentSchedule(schedules, currentTime);

  const styles = useMemo(() => createStyles(theme), [theme]);

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
              <Text style={styles.greeting}>{t('app.greeting')}</Text>
              <Text style={styles.title}>{t('app.name')}</Text>
            </View>
            <View style={styles.timeCard}>
              <Text style={styles.timeLabel}>{t('app.currentTime')}</Text>
              <Text style={styles.timeValue}>{currentTime}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <CurrentScheduleCard schedule={currentSchedule} />

          <View style={styles.clockSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('app.todaySchedules')}</Text>
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

const createStyles = (theme: Theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.background.secondary,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  timeCard: {
    backgroundColor: theme.colors.accent.indigo,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  timeLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: 2,
  },
  timeValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    fontFamily: 'monospace',
  },
  content: {
    flex: 1,
  },
  clockSection: {
    paddingTop: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  scheduleCount: {
    backgroundColor: theme.colors.accent.indigo,
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleCountText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  clockContainer: {
    alignItems: 'center',
  },
  fabContainer: {
    position: 'absolute',
    right: theme.spacing.xl,
    bottom: theme.spacing.xxxl,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.accent.indigo,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg,
  },
  fabIcon: {
    fontSize: 32,
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.normal,
    lineHeight: 32,
  },
});
