import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CategoryPicker } from '@/components/CategoryPicker';
import { TimeSelector } from '@/components/TimeSelector';
import { useScheduleStore } from '@/store/scheduleStore';
import { CategoryType } from '@/types';
import { getCategoryColor } from '@/utils/colorUtils';
import { isEndTimeValid } from '@/utils/timeUtils';
import { hasOverlap } from '@/utils/scheduleUtils';
import { DESIGN_SYSTEM } from '@/constants/Design';

export default function ModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scheduleId = params.scheduleId as string | undefined;

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
      Alert.alert('오류', '제목을 입력해주세요');
      return;
    }

    if (!isEndTimeValid(startTime, endTime)) {
      Alert.alert('오류', '종료 시간은 시작 시간 이후여야 합니다');
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
        '시간 중복',
        '이미 다른 일정이 있습니다. 계속하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '계속',
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

    Alert.alert('일정 삭제', '이 일정을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
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
          <Text style={styles.subtitle}>{scheduleId ? '수정' : '새로운 일정'}</Text>
          <Text style={styles.title}>{scheduleId ? '일정 편집' : '일정 만들기'}</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <View style={styles.field}>
            <Text style={styles.label}>제목 *</Text>
            <TextInput
              style={styles.input}
              placeholder="일정 제목을 입력하세요"
              placeholderTextColor={DESIGN_SYSTEM.colors.text.tertiary}
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
            <Text style={styles.charCount}>{title.length}/50</Text>
          </View>

          <View style={styles.divider} />

          <TimeSelector label="시작 시간" time={startTime} onChange={setStartTime} />
          <TimeSelector label="종료 시간" time={endTime} onChange={setEndTime} />

          <View style={styles.divider} />

          <CategoryPicker selectedCategory={category} onSelect={setCategory} />

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={styles.label}>알림 받기</Text>
              <Text style={styles.switchDescription}>일정 시작 시 알림을 받습니다</Text>
            </View>
            <Switch 
              value={notificationEnabled} 
              onValueChange={setNotificationEnabled}
              trackColor={{ false: '#D1D5DB', true: DESIGN_SYSTEM.colors.primary + '40' }}
              thumbColor={notificationEnabled ? DESIGN_SYSTEM.colors.primary : '#F3F4F6'}
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
              {scheduleId ? '✓ 수정 완료' : '+ 일정 추가'}
            </Text>
          </TouchableOpacity>

          {scheduleId && (
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleDelete}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteButtonText}>🗑️ 일정 삭제</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: DESIGN_SYSTEM.spacing.xl,
    paddingTop: DESIGN_SYSTEM.spacing.md,
  },
  header: {
    marginBottom: DESIGN_SYSTEM.spacing.xxl,
  },
  subtitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.display,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.extrabold,
    color: DESIGN_SYSTEM.colors.text.primary,
  },
  formCard: {
    backgroundColor: DESIGN_SYSTEM.colors.background.primary,
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    padding: DESIGN_SYSTEM.spacing.xl,
    marginBottom: DESIGN_SYSTEM.spacing.xl,
    ...DESIGN_SYSTEM.shadows.md,
  },
  field: {
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },
  label: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.md,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
    color: DESIGN_SYSTEM.colors.text.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  input: {
    backgroundColor: DESIGN_SYSTEM.colors.background.secondary,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    padding: DESIGN_SYSTEM.spacing.lg,
    fontSize: DESIGN_SYSTEM.typography.fontSize.md,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    color: DESIGN_SYSTEM.colors.text.primary,
  },
  charCount: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xs,
    color: DESIGN_SYSTEM.colors.text.tertiary,
    textAlign: 'right',
    marginTop: DESIGN_SYSTEM.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: DESIGN_SYSTEM.spacing.lg,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
  },
  switchLabel: {
    flex: 1,
  },
  switchDescription: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    color: DESIGN_SYSTEM.colors.text.secondary,
    marginTop: DESIGN_SYSTEM.spacing.xs,
  },
  buttons: {
    gap: DESIGN_SYSTEM.spacing.md,
    marginBottom: DESIGN_SYSTEM.spacing.xl,
  },
  saveButton: {
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    padding: DESIGN_SYSTEM.spacing.lg,
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    alignItems: 'center',
    ...DESIGN_SYSTEM.shadows.md,
  },
  saveButtonText: {
    color: DESIGN_SYSTEM.colors.text.inverse,
    fontSize: DESIGN_SYSTEM.typography.fontSize.lg,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    padding: DESIGN_SYSTEM.spacing.lg,
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: DESIGN_SYSTEM.typography.fontSize.lg,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
  },
  cancelButton: {
    backgroundColor: DESIGN_SYSTEM.colors.background.tertiary,
    padding: DESIGN_SYSTEM.spacing.lg,
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: DESIGN_SYSTEM.colors.text.secondary,
    fontSize: DESIGN_SYSTEM.typography.fontSize.lg,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
  },
});
