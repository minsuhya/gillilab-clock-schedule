# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ClockPlan** - 24시간 원형 시계 UI로 일정을 관리하는 React Native 앱 (Expo)

Tech Stack: Expo SDK 54, React Native 0.81.5, TypeScript, Zustand, AsyncStorage, React Native SVG

## Common Commands

```bash
# Development
npm start                    # Start Expo dev server
npm run ios                  # Run on iOS simulator
npm run android              # Run on Android emulator

# Testing
npm test                     # Run all tests
npm test -- timeUtils.test   # Run specific test file
npm run test:watch           # Watch mode

# Type checking
npx tsc --noEmit

# Build
npx expo export --platform all
```

## Architecture

### Core Data Flow
```
User Input → Zustand Store → AsyncStorage (persist)
                ↓
         Components (ClockView, EventList)
                ↓
         SVG Rendering (EventArc)
```

### Time-Angle Conversion (핵심 로직)
시계 렌더링의 핵심: 12시 방향 = -90도 (SVG 기준)
- `timeToAngle("00:00")` → -90°
- `timeToAngle("06:00")` → 0°
- `timeToAngle("12:00")` → 90°
- `timeToAngle("18:00")` → 180°

Utils: `utils/timeUtils.ts`

### State Management
- **Zustand Store** (`store/scheduleStore.ts`): CRUD + persist middleware
- **AsyncStorage Key**: `@clockplan:schedules`
- 알림 스케줄링/취소 자동 처리

### UI Components Hierarchy
```
ClockView
├── ClockFace (24시간 눈금, 중앙 원)
├── ClockHands (현재 시간 표시)
└── EventArc[] (일정별 호 SVG)

EventList
└── EventItem[] (일정 카드)
```

## Code Conventions

### Imports Order
1. React/React Native
2. Third-party (Svg, AsyncStorage)
3. Internal (`@/store`, `@/utils`, `@/types`, `@/constants`)

### Naming
- Components: PascalCase (`ClockView.tsx`)
- Utils: camelCase (`timeUtils.ts`)
- Constants: UPPER_SNAKE_CASE (`CLOCK_CONFIG`)
- Props: `{Component}Props` (`ClockViewProps`)

### Component Structure
```typescript
interface Props { }

export const Component: React.FC<Props> = ({ ... }) => {
  // 1. Hooks
  // 2. Derived values
  // 3. Handlers
  // 4. Return JSX
};
```

## Key Files

| Path | Description |
|------|-------------|
| `store/scheduleStore.ts` | Zustand store with persist |
| `utils/timeUtils.ts` | Time ↔ Angle conversion |
| `utils/notifications.ts` | expo-notifications wrapper |
| `constants/Clock.ts` | Clock UI config (RADIUS: 140, STROKE_WIDTH: 20) |
| `constants/Categories.ts` | 5 default categories |
| `types/index.ts` | Schedule, Category interfaces |

## Data Models

```typescript
interface Schedule {
  id: string;
  title: string;
  startTime: string;      // "HH:mm"
  endTime: string;        // "HH:mm"
  category: CategoryType; // 'work' | 'personal' | 'exercise' | 'study' | 'meeting'
  color: string;
  notificationEnabled: boolean;
  notificationId?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Development Notes

- 한국어 UI: 사용자 표시 문자열은 한국어 사용 (일정, 추가, 저장 등)
- 자정 넘어가는 일정 미지원 (MVP 제한)
- 시간 형식: "HH:mm" (24시간제, 2자리 패딩)
- 테스트: `__tests__/timeUtils.test.ts`에 19개 단위 테스트

## References

- Architecture: `docs/architecture.md`
- Feature specs: `docs/features.md`
- Development guide: `AGENTS.md`
