import React, { useEffect, useRef } from 'react';
import { Path, G } from 'react-native-svg';
import { Animated } from 'react-native';
import { Schedule } from '@/types';
import { timeToAngle } from '@/utils/timeUtils';
import { CLOCK_CONFIG } from '@/constants/Clock';

interface EventArcProps {
  schedule: Schedule;
  centerX: number;
  centerY: number;
  onPress?: () => void;
  isCurrent?: boolean;
}

export const EventArc: React.FC<EventArcProps> = ({
  schedule,
  centerX,
  centerY,
  onPress,
  isCurrent = false,
}) => {
  const { RADIUS, STROKE_WIDTH } = CLOCK_CONFIG;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isCurrent) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isCurrent, pulseAnim]);

  const startAngle = timeToAngle(schedule.startTime);
  const endAngle = timeToAngle(schedule.endTime);

  const createArcPath = (
    startAngleDeg: number,
    endAngleDeg: number,
    radius: number
  ): string => {
    const startRad = (startAngleDeg * Math.PI) / 180;
    const endRad = (endAngleDeg * Math.PI) / 180;

    const startX = centerX + radius * Math.cos(startRad);
    const startY = centerY + radius * Math.sin(startRad);
    const endX = centerX + radius * Math.cos(endRad);
    const endY = centerY + radius * Math.sin(endRad);

    let angleDiff = endAngleDeg - startAngleDeg;
    if (angleDiff < 0) {
      angleDiff += 360;
    }

    const largeArcFlag = angleDiff > 180 ? 1 : 0;

    return `
      M ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
    `;
  };

  const arcPath = createArcPath(startAngle, endAngle, RADIUS);

  return (
    <G onPress={onPress}>
      <Path
        d={arcPath}
        stroke={schedule.color}
        strokeWidth={isCurrent ? STROKE_WIDTH * 1.3 : STROKE_WIDTH}
        fill="none"
        strokeLinecap="round"
        opacity={isCurrent ? 1 : 0.9}
      />
      {isCurrent && (
        <Path
          d={arcPath}
          stroke={schedule.color}
          strokeWidth={STROKE_WIDTH * 1.6}
          fill="none"
          strokeLinecap="round"
          opacity={0.3}
        />
      )}
    </G>
  );
};
