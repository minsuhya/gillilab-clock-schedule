import React, { useMemo } from 'react';
import { Svg, Circle, Line, Text as SvgText, G, Defs, RadialGradient, Stop, Path } from 'react-native-svg';
import { CLOCK_CONFIG } from '@/constants/Clock';
import { ClockHands } from './ClockHands';
import { useTheme } from '@/hooks/useTheme';

interface ClockFaceProps {
  size: number;
  showHands?: boolean;
}

export const ClockFace: React.FC<ClockFaceProps> = ({ size, showHands = true }) => {
  const { theme, colorScheme } = useTheme();
  const centerX = size / 2;
  const centerY = size / 2;
  const { RADIUS, CENTER_RADIUS, HOUR_MARK_LENGTH, TOTAL_HOURS } = CLOCK_CONFIG;

  const isDark = colorScheme === 'dark';

  const colors = useMemo(() => ({
    mainCircle: isDark ? theme.colors.border.medium : '#E5E7EB',
    centerFill: isDark ? theme.colors.background.tertiary : '#F3F4F6',
    centerStroke: isDark ? theme.colors.border.dark : '#D1D5DB',
    majorMark: isDark ? theme.colors.text.secondary : '#374151',
    minorMark: isDark ? theme.colors.border.dark : '#9CA3AF',
    microMark: isDark ? theme.colors.border.light : '#D1D5DB',
    numberMain: isDark ? theme.colors.text.primary : '#1F2937',
    numberSecondary: isDark ? theme.colors.text.secondary : '#6B7280',
    glowColor: isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.15)',
  }), [isDark, theme]);

  const renderTimeZoneBackground = () => {
    if (isDark) return null;
    
    const zones = [
      { start: 0, end: 6, color: '#1e3a8a', opacity: 0.05, label: 'Night' },
      { start: 6, end: 12, color: '#f59e0b', opacity: 0.08, label: 'Morning' },
      { start: 12, end: 18, color: '#3b82f6', opacity: 0.06, label: 'Day' },
      { start: 18, end: 24, color: '#7c3aed', opacity: 0.07, label: 'Evening' },
    ];

    return zones.map((zone, index) => {
      const startAngle = (zone.start / 24) * 360 - 90;
      const endAngle = (zone.end / 24) * 360 - 90;
      const largeArcFlag = zone.end - zone.start > 12 ? 1 : 0;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const outerStartX = centerX + RADIUS * Math.cos(startRad);
      const outerStartY = centerY + RADIUS * Math.sin(startRad);
      const outerEndX = centerX + RADIUS * Math.cos(endRad);
      const outerEndY = centerY + RADIUS * Math.sin(endRad);

      const innerRadius = CENTER_RADIUS + 5;
      const innerStartX = centerX + innerRadius * Math.cos(startRad);
      const innerStartY = centerY + innerRadius * Math.sin(startRad);
      const innerEndX = centerX + innerRadius * Math.cos(endRad);
      const innerEndY = centerY + innerRadius * Math.sin(endRad);

      const pathData = `
        M ${outerStartX},${outerStartY}
        A ${RADIUS},${RADIUS} 0 ${largeArcFlag} 1 ${outerEndX},${outerEndY}
        L ${innerEndX},${innerEndY}
        A ${innerRadius},${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX},${innerStartY}
        Z
      `;

      return (
        <Path
          key={`zone-${index}`}
          d={pathData}
          fill={zone.color}
          opacity={zone.opacity}
        />
      );
    });
  };

  const renderHourMarks = () => {
    const marks = [];
    
    for (let i = 0; i < TOTAL_HOURS; i++) {
      const angle = (i / TOTAL_HOURS) * 360 - 90;
      const radian = (angle * Math.PI) / 180;
      
      const isMajorHour = i % 6 === 0;
      const isMinorHour = i % 3 === 0;
      
      let markLength: number;
      let strokeWidth: number;
      let strokeColor: string;
      
      if (isMajorHour) {
        markLength = HOUR_MARK_LENGTH * 2;
        strokeWidth = 3;
        strokeColor = colors.majorMark;
      } else if (isMinorHour) {
        markLength = HOUR_MARK_LENGTH * 1.5;
        strokeWidth = 2;
        strokeColor = colors.minorMark;
      } else {
        markLength = HOUR_MARK_LENGTH;
        strokeWidth = 1.5;
        strokeColor = colors.microMark;
      }
      
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
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      );
    }
    return marks;
  };

  const renderHourNumbers = () => {
    const numbers = [];
    
    for (let i = 0; i < TOTAL_HOURS; i++) {
      const angle = (i / TOTAL_HOURS) * 360 - 90;
      const radian = (angle * Math.PI) / 180;
      
      const isMajorHour = i % 6 === 0;
      
      const textRadius = RADIUS - (isMajorHour ? 35 : 28);
      const textX = centerX + textRadius * Math.cos(radian);
      const textY = centerY + textRadius * Math.sin(radian);
      
      const fontSize = isMajorHour ? 18 : 13;
      const fontWeight = isMajorHour ? '700' : '600';
      const fillColor = isMajorHour ? colors.numberMain : colors.numberSecondary;

      numbers.push(
        <G key={`number-${i}`}>
          {isMajorHour && (
            <Circle
              cx={textX}
              cy={textY}
              r={14}
              fill={colors.glowColor}
            />
          )}
          <SvgText
            x={textX}
            y={textY}
            fontSize={fontSize}
            fontWeight={fontWeight}
            fill={fillColor}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {i}
          </SvgText>
        </G>
      );
    }
    return numbers;
  };

  const renderCurrentTimeIndicator = () => {
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    const angle = (currentHour / 24) * 360 - 90;
    const radian = (angle * Math.PI) / 180;

    const indicatorRadius = RADIUS + 8;
    const indicatorX = centerX + indicatorRadius * Math.cos(radian);
    const indicatorY = centerY + indicatorRadius * Math.sin(radian);

    return (
      <G>
        <Circle
          cx={indicatorX}
          cy={indicatorY}
          r={6}
          fill={isDark ? '#818CF8' : '#6366F1'}
          opacity={0.9}
        />
        <Circle
          cx={indicatorX}
          cy={indicatorY}
          r={10}
          fill={isDark ? '#818CF8' : '#6366F1'}
          opacity={0.3}
        />
        <Circle
          cx={indicatorX}
          cy={indicatorY}
          r={3}
          fill="#FFFFFF"
        />
      </G>
    );
  };

  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id="centerGlow" cx="50%" cy="50%">
          <Stop offset="0%" stopColor={colors.glowColor} stopOpacity="0.4" />
          <Stop offset="70%" stopColor={colors.glowColor} stopOpacity="0.1" />
          <Stop offset="100%" stopColor={colors.glowColor} stopOpacity="0" />
        </RadialGradient>
      </Defs>

      <G>
        <Circle
          cx={centerX}
          cy={centerY}
          r={RADIUS + 15}
          fill="url(#centerGlow)"
        />

        <Circle
          cx={centerX}
          cy={centerY}
          r={RADIUS}
          fill="none"
          stroke={colors.mainCircle}
          strokeWidth={2}
        />

        {renderTimeZoneBackground()}

        <Circle
          cx={centerX}
          cy={centerY}
          r={CENTER_RADIUS}
          fill={colors.centerFill}
          stroke={colors.centerStroke}
          strokeWidth={1}
        />

        {renderHourMarks()}
        {renderHourNumbers()}
        {renderCurrentTimeIndicator()}
        
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
