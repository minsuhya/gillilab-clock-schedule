import React, { useEffect } from 'react';
import { Line, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ClockHandsProps {
  centerX: number;
  centerY: number;
  radius: number;
}

export const ClockHands: React.FC<ClockHandsProps> = ({ centerX, centerY, radius }) => {
  const hourAngle = useSharedValue(0);
  const minuteAngle = useSharedValue(0);
  const secondAngle = useSharedValue(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      const newHourAngle = ((hours + minutes / 60 + seconds / 3600) / 24) * 360 - 90;
      const newMinuteAngle = ((minutes + seconds / 60) / 60) * 360 - 90;
      const newSecondAngle = ((seconds + milliseconds / 1000) / 60) * 360 - 90;

      hourAngle.value = withTiming(newHourAngle, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      minuteAngle.value = withTiming(newMinuteAngle, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      secondAngle.value = withTiming(newSecondAngle, {
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const getHandEndpoint = (angle: number, length: number) => {
    'worklet';
    const radian = (angle * Math.PI) / 180;
    return {
      x: centerX + length * Math.cos(radian),
      y: centerY + length * Math.sin(radian),
    };
  };

  const hourLength = radius * 0.7;
  const minuteLength = radius * 1.15;
  const secondLength = radius * 1.05;

  const hourProps = useAnimatedProps(() => {
    const end = getHandEndpoint(hourAngle.value, hourLength);
    return {
      x2: end.x,
      y2: end.y,
    };
  });

  const minuteProps = useAnimatedProps(() => {
    const end = getHandEndpoint(minuteAngle.value, minuteLength);
    return {
      x2: end.x,
      y2: end.y,
    };
  });

  const secondProps = useAnimatedProps(() => {
    const end = getHandEndpoint(secondAngle.value, secondLength);
    return {
      x2: end.x,
      y2: end.y,
    };
  });

  const secondTipProps = useAnimatedProps(() => {
    const end = getHandEndpoint(secondAngle.value, secondLength);
    return {
      cx: end.x,
      cy: end.y,
    };
  });

  return (
    <G>
      <Defs>
        <LinearGradient id="hourGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#1F2937" stopOpacity="1" />
          <Stop offset="100%" stopColor="#374151" stopOpacity="0.8" />
        </LinearGradient>
        <LinearGradient id="minuteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#4B5563" stopOpacity="1" />
          <Stop offset="100%" stopColor="#6B7280" stopOpacity="0.7" />
        </LinearGradient>
        <LinearGradient id="secondGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#EF4444" stopOpacity="1" />
          <Stop offset="100%" stopColor="#F87171" stopOpacity="0.8" />
        </LinearGradient>
      </Defs>

      <AnimatedLine
        x1={centerX}
        y1={centerY}
        animatedProps={hourProps}
        stroke="url(#hourGradient)"
        strokeWidth={8}
        strokeLinecap="round"
        opacity={0.95}
      />

      <AnimatedLine
        x1={centerX}
        y1={centerY}
        animatedProps={minuteProps}
        stroke="url(#minuteGradient)"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.9}
      />

      <AnimatedLine
        x1={centerX}
        y1={centerY}
        animatedProps={secondProps}
        stroke="url(#secondGradient)"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.85}
      />

      <Circle
        cx={centerX}
        cy={centerY}
        r={10}
        fill="#1F2937"
        stroke="#FFFFFF"
        strokeWidth={3}
      />

      <Circle
        cx={centerX}
        cy={centerY}
        r={6}
        fill="#374151"
      />

      <AnimatedCircle
        animatedProps={secondTipProps}
        r={5}
        fill="#EF4444"
        opacity={0.9}
      />

      <AnimatedCircle
        animatedProps={secondTipProps}
        r={8}
        fill="#EF4444"
        opacity={0.2}
      />
    </G>
  );
};
