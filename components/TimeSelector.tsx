import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { DESIGN_SYSTEM } from '@/constants/Design';

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

const styles = StyleSheet.create({
  container: {
    marginVertical: DESIGN_SYSTEM.spacing.sm,
  },
  label: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.md,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
    color: DESIGN_SYSTEM.colors.text.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  timeButton: {
    backgroundColor: DESIGN_SYSTEM.colors.background.secondary,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    padding: DESIGN_SYSTEM.spacing.lg,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DESIGN_SYSTEM.spacing.sm,
  },
  timeIcon: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xl,
  },
  timeText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xl,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
    color: DESIGN_SYSTEM.colors.text.primary,
    fontFamily: 'monospace',
  },
});
