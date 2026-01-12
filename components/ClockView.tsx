import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Svg, G } from 'react-native-svg';
import { Schedule } from '@/types';
import { ClockFace } from './ClockFace';
import { EventArc } from './EventArc';

interface ClockViewProps {
  schedules: Schedule[];
  onEventPress: (schedule: Schedule) => void;
  onClockPress?: () => void;
  currentScheduleId?: string | null;
}

export const ClockView: React.FC<ClockViewProps> = ({
  schedules,
  onEventPress,
  onClockPress,
  currentScheduleId,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const size = Math.min(screenWidth - 32, 350);
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} onPress={onClockPress}>
        <Svg width={size} height={size}>
          <ClockFace size={size} />
          <G>
            {schedules.map((schedule) => (
              <EventArc
                key={schedule.id}
                schedule={schedule}
                centerX={centerX}
                centerY={centerY}
                onPress={() => onEventPress(schedule)}
                isCurrent={schedule.id === currentScheduleId}
              />
            ))}
          </G>
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
});
