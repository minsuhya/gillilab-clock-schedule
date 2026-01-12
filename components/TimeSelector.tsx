import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ViewStyle, TextStyle } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/constants/Theme';

interface TimeSelectorProps {
  label: string;
  time: string;
  onChange: (time: string) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  label,
  time,
  onChange,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(() => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  });

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }

    if (selectedDate && event.type === 'set') {
      setTempDate(selectedDate);
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      onChange(`${hours}:${minutes}`);
    } else if (event.type === 'dismissed') {
      setShow(false);
    }
  };

  const showTimePicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.timeButton} 
        onPress={showTimePicker}
        activeOpacity={0.7}
      >
        <View style={styles.timeDisplay}>
          <Text style={styles.timeIcon}>🕐</Text>
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={tempDate}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create<{
  container: ViewStyle;
  label: TextStyle;
  timeButton: ViewStyle;
  timeDisplay: ViewStyle;
  timeIcon: TextStyle;
  timeText: TextStyle;
}>({
  container: {
    marginVertical: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  timeButton: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  timeIcon: {
    fontSize: theme.typography.fontSize.xl,
  },
  timeText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.primary,
    fontFamily: 'monospace',
  },
});
