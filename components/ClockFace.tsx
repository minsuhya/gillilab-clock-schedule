import React from 'react';
import { Svg, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { CLOCK_CONFIG } from '@/constants/Clock';
import { ClockHands } from './ClockHands';

interface ClockFaceProps {
  size: number;
  showHands?: boolean;
}

export const ClockFace: React.FC<ClockFaceProps> = ({ size, showHands = true }) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const { RADIUS, CENTER_RADIUS, HOUR_MARK_LENGTH, TOTAL_HOURS } = CLOCK_CONFIG;

  const renderHourMarks = () => {
    const marks = [];
    for (let i = 0; i < TOTAL_HOURS; i++) {
      const angle = (i / TOTAL_HOURS) * 360 - 90;
      const radian = (angle * Math.PI) / 180;
      
      const isMainHour = i % 6 === 0;
      const markLength = isMainHour ? HOUR_MARK_LENGTH * 1.5 : HOUR_MARK_LENGTH;
      const strokeWidth = isMainHour ? 2 : 1;
      
      const x1 = centerX + (RADIUS - markLength) * Math.cos(radian);
      const y1 = centerY + (RADIUS - markLength) * Math.sin(radian);
      const x2 = centerX + RADIUS * Math.cos(radian);
      const y2 = centerY + RADIUS * Math.sin(radian);

      marks.push(
        <Line
          key={`mark-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#9CA3AF"
          strokeWidth={strokeWidth}
        />
      );

      if (isMainHour) {
        const textRadius = RADIUS - markLength - 20;
        const textX = centerX + textRadius * Math.cos(radian);
        const textY = centerY + textRadius * Math.sin(radian);

        marks.push(
          <SvgText
            key={`text-${i}`}
            x={textX}
            y={textY}
            fontSize="14"
            fontWeight="600"
            fill="#374151"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {i}
          </SvgText>
        );
      }
    }
    return marks;
  };

  return (
    <Svg width={size} height={size}>
      <G>
        <Circle
          cx={centerX}
          cy={centerY}
          r={RADIUS}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={2}
        />

        <Circle
          cx={centerX}
          cy={centerY}
          r={CENTER_RADIUS}
          fill="#F3F4F6"
          stroke="#D1D5DB"
          strokeWidth={1}
        />

        {renderHourMarks()}
        
        {showHands && (
          <ClockHands
            centerX={centerX}
            centerY={centerY}
            radius={RADIUS}
          />
        )}
      </G>
    </Svg>
  );
};
