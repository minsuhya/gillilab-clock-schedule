import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { EventList } from '@/components/EventList';
import { useScheduleStore } from '@/store/scheduleStore';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/constants/Theme';

export default function ListScreen() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
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
          <Text style={styles.subtitle}>{t('app.allSchedules')}</Text>
          <Text style={styles.title}>{t('app.scheduleList')}</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{schedules.length}</Text>
          <Text style={styles.countLabel}>{t('count.schedules')}</Text>
        </View>
      </View>
      <EventList schedules={schedules} onEventPress={handleEventPress} />
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create<{
  safeArea: ViewStyle;
  header: ViewStyle;
  subtitle: TextStyle;
  title: TextStyle;
  countBadge: ViewStyle;
  countText: TextStyle;
  countLabel: TextStyle;
}>({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.background.secondary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  title: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.extrabold as any,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: theme.colors.accent.indigo,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  countText: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.inverse,
  },
  countLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 2,
    fontWeight: theme.typography.fontWeight.semibold as any,
  },
});
