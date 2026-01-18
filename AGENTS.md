# AGENTS.md - ClockPlan Development Guide

> Guidance for agentic coding assistants working in this repository.

## Project Snapshot

- **Stack**: Expo (React Native), TypeScript, Zustand, AsyncStorage, React Native SVG
- **App**: 24-hour clock UI for daily schedules
- **Status**: MVP implemented

## Rules from Other Tools

- **Cursor rules**: None found in `.cursor/rules/` or `.cursorrules`
- **Copilot rules**: None found in `.github/copilot-instructions.md`

## Commands

### Install

```bash
pnpm install
# or
npm install
```

### Run (Dev)

```bash
npm start               # Expo dev server
npm run ios             # Expo dev server + iOS simulator
npm run android         # Expo dev server + Android emulator
npm run web             # Expo dev server + web
```

### Native Builds / Export

```bash
npx expo run:ios
npx expo run:android
npx expo export --platform all
npx expo prebuild
npx eas build
```

### Tests

```bash
npm test                           # All tests
npm test -- timeUtils.test.ts      # Single test file
npm test -- -t "pattern"           # Match test name
npm run test:watch                 # Watch mode
```

### Type Checking

```bash
npx tsc --noEmit
```

### Lint

- No lint script is defined in `package.json`. Ask before introducing lint tooling.

## Code Style

### TypeScript

- No `any`. Use explicit interfaces and types.
- Prefer `interface` for object shapes; use `type` for unions/aliases.
- Keep function input/output types explicit when public or reused.
- Use `Schedule`, `Category`, `ClockConfig` from `types/index.ts` as the source of truth.

### Imports

Order imports by category, with a blank line between groups:

1. React / React Native
2. Third-party libraries
3. Internal modules (use `@/` alias)

```typescript
import React, { useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useScheduleStore } from '@/store/scheduleStore';
import { timeToAngle } from '@/utils/timeUtils';
```

### Naming

- Components: PascalCase (`ClockView.tsx`)
- Utilities: camelCase (`timeUtils.ts`)
- Constants: UPPER_SNAKE_CASE (`CLOCK_CONFIG`)
- Functions/variables: camelCase (`timeToAngle`)
- Interfaces: PascalCase (`Schedule`)
- Props: `{ComponentName}Props` (`ClockViewProps`)

### Component Structure

```typescript
interface ComponentProps {
  // props
}

export const Component: React.FC<ComponentProps> = ({ ... }) => {
  // 1. Hooks
  // 2. Derived values
  // 3. Handlers
  // 4. Render
  return <View />;
};
```

### Error Handling

- Wrap AsyncStorage and notifications in `try/catch`.
- Log meaningful errors via `console.error` and return safe fallbacks.
- Guard permissions before scheduling notifications.

### Localization

- User-facing strings should be **Korean** by default.
- Use the existing i18n setup when present (`i18n/config.ts`).

### Time Rules

- Time format is **"HH:mm"** (24-hour, zero-padded).
- Midnight-spanning schedules are **not supported** in MVP.

### Performance

- Prefer `React.memo` for presentational components where useful.
- Avoid inline handlers in render; use `useCallback`.
- Use `FlatList` for lists (see `components/EventList.tsx`).

## Project Structure (Key Paths)

```
app/            Expo Router pages
components/     Reusable UI components
store/          Zustand stores
types/          TypeScript interfaces
utils/          Helpers (time, storage, notifications)
constants/      App constants and themes
__tests__/      Jest tests
```

## Testing Notes

- Tests live in `__tests__/` and use `jest-expo`.
- Single test file: `npm test -- timeUtils.test.ts`.
- Update `jest.config.js` only if necessary.

## Data & State Patterns

- Zustand store uses `persist` middleware with AsyncStorage.
- When creating schedules, ensure `createdAt` and `updatedAt` are set.
- Notification scheduling is handled in `utils/notifications.ts`.

## Docs to Follow

- `docs/architecture.md` for data models and component structure
- `docs/features.md` for product scope and flows
- `README.md` for setup and overview
