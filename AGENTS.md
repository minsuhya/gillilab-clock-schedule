# AGENTS.md - ClockPlan Development Guide

> Guide for AI coding agents working on the ClockPlan (시계형 하루 일정 관리) project.

## Project Overview

**Tech Stack**: Expo (React Native), TypeScript, Zustand, AsyncStorage, React Native SVG  
**Target**: iOS/Android schedule management app with 24-hour clock UI  
**Status**: Initial phase - documentation complete, implementation pending

## Build Commands

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Type checking
npx tsc --noEmit

# Run tests (when implemented)
npm test

# Run single test file
npm test -- timeUtils.test.ts

# Lint (when configured)
npm run lint
```

## Project Structure

```
app/              # Expo Router pages (index.tsx, list.tsx, modal.tsx)
components/       # Reusable UI components (ClockView, EventArc, etc.)
store/            # Zustand state management (scheduleStore.ts)
types/            # TypeScript type definitions
utils/            # Helper functions (timeUtils, colorUtils, notifications)
constants/        # App constants (Colors, Categories, Clock config)
docs/             # Architecture and feature documentation
```

## Code Style Guidelines

### TypeScript

**Use strict typing**:
```typescript
// ✅ Good - explicit types
interface Schedule {
  id: string;
  title: string;
  startTime: string;  // "HH:mm"
  endTime: string;    // "HH:mm"
  category: CategoryType;
  color: string;
  notificationEnabled: boolean;
}

// ❌ Bad - any types
function addSchedule(data: any) { }
```

**Prefer interfaces over types for objects**:
```typescript
// ✅ Good
interface ClockViewProps {
  schedules: Schedule[];
  onEventPress: (schedule: Schedule) => void;
}

// ❌ Avoid for object shapes
type ClockViewProps = { ... }
```

### Imports

**Ordered by category**:
```typescript
// 1. React/React Native
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// 2. Third-party libraries
import { Svg, Path, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 3. Internal modules
import { scheduleStore } from '@/store/scheduleStore';
import { timeToAngle } from '@/utils/timeUtils';
import { Schedule } from '@/types';
import { CLOCK_CONFIG } from '@/constants/Clock';
```

### Naming Conventions

- **Components**: PascalCase (`ClockView.tsx`, `EventArc.tsx`)
- **Files**: camelCase for utils (`timeUtils.ts`, `colorUtils.ts`)
- **Constants**: UPPER_SNAKE_CASE (`CLOCK_CONFIG`, `DEFAULT_CATEGORIES`)
- **Functions**: camelCase (`timeToAngle`, `scheduleNotification`)
- **Interfaces**: PascalCase (`Schedule`, `Category`)
- **Props interfaces**: `{ComponentName}Props` (`ClockViewProps`)

### Component Structure

```typescript
// Functional components with TypeScript
interface EventArcProps {
  schedule: Schedule;
  radius: number;
  strokeWidth: number;
  onPress: () => void;
}

export const EventArc: React.FC<EventArcProps> = ({
  schedule,
  radius,
  strokeWidth,
  onPress,
}) => {
  // 1. Hooks
  const [isPressed, setIsPressed] = useState(false);
  
  // 2. Derived values
  const startAngle = timeToAngle(schedule.startTime);
  const endAngle = timeToAngle(schedule.endTime);
  
  // 3. Handlers
  const handlePress = () => {
    setIsPressed(true);
    onPress();
  };
  
  // 4. Render
  return (
    <Path
      d={createArcPath(startAngle, endAngle, radius)}
      stroke={schedule.color}
      strokeWidth={strokeWidth}
      onPress={handlePress}
    />
  );
};
```

### State Management (Zustand)

```typescript
// store/scheduleStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ScheduleStore {
  schedules: Schedule[];
  addSchedule: (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSchedule: (id: string, updates: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set) => ({
      schedules: [],
      addSchedule: (schedule) => set((state) => ({
        schedules: [...state.schedules, {
          ...schedule,
          id: uuid.v4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }],
      })),
      // ... other actions
    }),
    {
      name: '@clockplan:schedules',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Error Handling

```typescript
// ✅ Good - handle async errors
async function scheduleNotification(schedule: Schedule): Promise<string | null> {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.warn('Notification permission denied');
      return null;
    }
    
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: { title: schedule.title, body: `${schedule.startTime} - ${schedule.endTime}` },
      trigger: { /* ... */ },
    });
    
    return notificationId;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
}

// ❌ Bad - unhandled promise
async function scheduleNotification(schedule: Schedule) {
  const notificationId = await Notifications.scheduleNotificationAsync({ /* ... */ });
  return notificationId; // Crashes on error
}
```

### Performance

- **Memoize expensive components**: `React.memo(EventArc)`
- **Use FlatList for lists**: `windowSize={5}` for large datasets
- **Avoid inline functions in renders**:
  ```typescript
  // ✅ Good
  const handlePress = useCallback(() => { /* ... */ }, [deps]);
  
  // ❌ Bad
  <Button onPress={() => { /* ... */ }} />
  ```

## Key Constants

```typescript
// constants/Clock.ts
export const CLOCK_CONFIG = {
  RADIUS: 140,
  STROKE_WIDTH: 20,
  CENTER_RADIUS: 50,
  HOUR_MARK_LENGTH: 10,
  TOTAL_HOURS: 24,
  ANIMATION_DURATION: 300,
};

// constants/Categories.ts
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: '업무', color: '#3B82F6', icon: '💼' },
  { id: 'personal', name: '개인', color: '#10B981', icon: '🏠' },
  { id: 'exercise', name: '운동', color: '#EF4444', icon: '🏃' },
  { id: 'study', name: '공부', color: '#8B5CF6', icon: '📚' },
  { id: 'meeting', name: '미팅', color: '#F59E0B', icon: '🤝' },
];
```

## Core Logic

### Time ↔ Angle Conversion
```typescript
// utils/timeUtils.ts
export function timeToAngle(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  return (totalMinutes / 1440) * 360 - 90; // 12 o'clock = 0°
}

export function angleToTime(angle: number): string {
  const adjustedAngle = (angle + 90) % 360;
  const totalMinutes = Math.round((adjustedAngle / 360) * 1440);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
```

## Documentation References

- **Architecture**: `docs/architecture.md` - System design, data models, component structure
- **Features**: `docs/features.md` - Detailed feature specifications, user flows
- **README**: Project overview, quick start guide

## Testing Guidelines (To Be Implemented)

- **Unit tests**: Utils (timeUtils, colorUtils) - Jest
- **Component tests**: React Native Testing Library
- **E2E tests**: Detox (optional, Phase 2)

## Git Workflow

- **Commit format**: `feat: add ClockView component` / `fix: time conversion bug`
- **Branch naming**: `feature/clock-view`, `fix/notification-crash`

## Notes for AI Agents

1. **Start with core utils**: Implement `timeUtils.ts` and `types/index.ts` first
2. **Follow docs strictly**: All data models in `docs/architecture.md` are authoritative
3. **No placeholder data**: Use proper TypeScript types from the start
4. **Test time conversions**: Critical for clock rendering - verify edge cases (00:00, 23:59)
5. **Handle async properly**: All AsyncStorage and notification calls need error handling
6. **Korean UI text**: User-facing strings should be in Korean (일정, 추가, 저장, etc.)
