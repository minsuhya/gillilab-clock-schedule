import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CategoryPicker } from '@/components/CategoryPicker';
import { TimeSelector } from '@/components/TimeSelector';
import { useScheduleStore } from '@/store/scheduleStore';
import { CategoryType } from '@/types';
import { getCategoryColor } from '@/utils/colorUtils';
import { isEndTimeValid } from '@/utils/timeUtils';
import { hasOverlap } from '@/utils/scheduleUtils';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/constants/Theme';

export default function ModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scheduleId = params.scheduleId as string | undefined;
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { schedules, addSchedule, updateSchedule, deleteSchedule, getScheduleById } =
    useScheduleStore();

  const existingSchedule = scheduleId ? getScheduleById(scheduleId) : undefined;

  const [title, setTitle] = useState(existingSchedule?.title || '');
  const [startTime, setStartTime] = useState(existingSchedule?.startTime || '09:00');
  const [endTime, setEndTime] = useState(existingSchedule?.endTime || '10:00');
  const [category, setCategory] = useState<CategoryType>(
    existingSchedule?.category || 'work'
  );
  const [notificationEnabled, setNotificationEnabled] = useState(
    existingSchedule?.notificationEnabled ?? true
  );

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('error.error'), t('error.titleRequired'));
      return;
    }

    if (!isEndTimeValid(startTime, endTime)) {
      Alert.alert(t('error.error'), t('error.invalidEndTime'));
      return;
    }

    const scheduleData = {
      title: title.trim(),
      startTime,
      endTime,
      category,
      color: getCategoryColor(category),
      notificationEnabled,
    };

    const tempSchedule = {
      id: scheduleId || 'temp',
      ...scheduleData,
      notificationId: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (hasOverlap(tempSchedule, schedules)) {
      Alert.alert(
        t('error.timeConflict'),
        t('error.timeConflictMessage'),
        [
          { text: t('schedule.cancel'), style: 'cancel' },
          {
            text: t('schedule.continue'),
            onPress: async () => {
              await saveSchedule(scheduleData);
            },
          },
        ]
      );
    } else {
      await saveSchedule(scheduleData);
    }
  };

  const saveSchedule = async (data: any) => {
    if (scheduleId) {
      await updateSchedule(scheduleId, data);
    } else {
      await addSchedule(data);
    }
    router.back();
  };

  const handleDelete = () => {
    if (!scheduleId) return;

    Alert.alert(t('schedule.deleteSchedule'), t('schedule.deleteConfirm'), [
      { text: t('schedule.cancel'), style: 'cancel' },
      {
        text: t('schedule.delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteSchedule(scheduleId);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            {scheduleId ? t('schedule.edit') : t('schedule.new')}
          </Text>
          <Text style={styles.title}>
            {scheduleId ? t('schedule.editSchedule') : t('schedule.createSchedule')}
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <View style={styles.field}>
            <Text style={styles.label}>{t('form.title')} *</Text>
            <TextInput
              style={styles.input}
              placeholder={t('form.titlePlaceholder')}
              placeholderTextColor={theme.colors.text.tertiary}
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
            <Text style={styles.charCount}>{title.length}/50</Text>
          </View>

          <View style={styles.divider} />

          <TimeSelector label={t('form.startTime')} time={startTime} onChange={setStartTime} />
          <TimeSelector label={t('form.endTime')} time={endTime} onChange={setEndTime} />

          <View style={styles.divider} />

          <CategoryPicker selectedCategory={category} onSelect={setCategory} />

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={styles.label}>{t('form.notification')}</Text>
              <Text style={styles.switchDescription}>{t('form.notificationDescription')}</Text>
            </View>
            <Switch 
              value={notificationEnabled} 
              onValueChange={setNotificationEnabled}
              trackColor={{ false: '#D1D5DB', true: theme.colors.primary + '40' }}
              thumbColor={notificationEnabled ? theme.colors.primary : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              {scheduleId ? t('schedule.saveEdit') : t('schedule.add')}
            </Text>
          </TouchableOpacity>

          {scheduleId && (
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleDelete}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteButtonText}>{t('schedule.deleteButton')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>{t('schedule.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create<{
  container: ViewStyle;
  scrollView: ViewStyle;
  content: ViewStyle;
  header: ViewStyle;
  subtitle: TextStyle;
  title: TextStyle;
  formCard: ViewStyle;
  field: ViewStyle;
  label: TextStyle;
  input: TextStyle;
  charCount: TextStyle;
  divider: ViewStyle;
  switchRow: ViewStyle;
  switchLabel: ViewStyle;
  switchDescription: TextStyle;
  buttons: ViewStyle;
  saveButton: ViewStyle;
  saveButtonText: TextStyle;
  deleteButton: ViewStyle;
  deleteButtonText: TextStyle;
  cancelButton: ViewStyle;
  cancelButtonText: TextStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.xxl,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold as any,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.extrabold as any,
    color: theme.colors.text.primary,
  },
  formCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.md,
  },
  field: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    fontSize: theme.typography.fontSize.md,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    color: theme.colors.text.primary,
  },
  charCount: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.medium,
    marginVertical: theme.spacing.lg,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  switchLabel: {
    flex: 1,
  },
  switchDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  buttons: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  saveButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold as any,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold as any,
  },
  cancelButton: {
    backgroundColor: theme.colors.background.tertiary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold as any,
  },
});
