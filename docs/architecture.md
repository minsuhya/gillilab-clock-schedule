# 시스템 아키텍처

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| **프레임워크** | Expo (React Native) |
| **언어** | TypeScript |
| **상태 관리** | Zustand |
| **로컬 저장소** | AsyncStorage |
| **UI 컴포넌트** | React Native SVG, Reanimated |
| **알림** | expo-notifications |
| **내비게이션** | Expo Router |

## 프로젝트 구조

```
clock-schedule/
├── app/                          # Expo Router 앱 디렉토리
│   ├── (tabs)/                   # 탭 네비게이션
│   │   ├── index.tsx            # 메인 시계 화면
│   │   └── list.tsx             # 일정 리스트 화면
│   ├── _layout.tsx              # 루트 레이아웃
│   └── modal.tsx                # 일정 추가/편집 모달
│
├── components/                   # 재사용 컴포넌트
│   ├── ClockView.tsx            # 시계형 UI 메인 컴포넌트
│   ├── ClockFace.tsx            # 시계판 (24시간 표시)
│   ├── EventArc.tsx             # 일정 아크 렌더링
│   ├── TimeSelector.tsx         # 시간 선택 컴포넌트
│   ├── EventList.tsx            # 일정 목록
│   ├── EventItem.tsx            # 일정 아이템 카드
│   └── CategoryPicker.tsx       # 카테고리 선택기
│
├── store/                        # 상태 관리
│   └── scheduleStore.ts         # 일정 전역 상태 (Zustand)
│
├── types/                        # TypeScript 타입 정의
│   └── index.ts                 # Schedule, Category 등
│
├── utils/                        # 유틸리티 함수
│   ├── timeUtils.ts             # 시간 변환 (HH:mm ↔ 각도)
│   ├── colorUtils.ts            # 카테고리별 색상 매핑
│   ├── storage.ts               # AsyncStorage 래퍼
│   └── notifications.ts         # 알림 스케줄링
│
├── constants/                    # 상수 정의
│   ├── Colors.ts                # 색상 팔레트
│   └── Categories.ts            # 기본 카테고리 목록
│
└── docs/                         # 문서
    ├── architecture.md          # 본 문서
    └── features.md              # 기능 명세
```

## 데이터 모델

### Schedule (일정)

```typescript
interface Schedule {
  id: string;                    // UUID
  title: string;                 // 일정 제목
  startTime: string;             // "HH:mm" 형식 (예: "09:00")
  endTime: string;               // "HH:mm" 형식 (예: "10:30")
  category: CategoryType;        // 카테고리
  color: string;                 // Hex 색상 코드
  notificationEnabled: boolean;  // 알림 여부
  notificationId?: string;       // 알림 ID (expo-notifications)
  createdAt: string;             // ISO 8601 타임스탬프
  updatedAt: string;             // ISO 8601 타임스탬프
}
```

### Category (카테고리)

```typescript
type CategoryType = 'work' | 'personal' | 'exercise' | 'study' | 'meeting';

interface Category {
  id: CategoryType;
  name: string;
  color: string;
  icon: string;
}
```

### 기본 카테고리

```typescript
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: '업무', color: '#3B82F6', icon: '💼' },
  { id: 'personal', name: '개인', color: '#10B981', icon: '🏠' },
  { id: 'exercise', name: '운동', color: '#EF4444', icon: '🏃' },
  { id: 'study', name: '공부', color: '#8B5CF6', icon: '📚' },
  { id: 'meeting', name: '미팅', color: '#F59E0B', icon: '🤝' },
];
```

## 데이터 흐름

```
[사용자 입력]
    ↓
[ClockView / EventList]
    ↓
[scheduleStore (Zustand)]
    ↓
[AsyncStorage 저장]
    ↓
[notification 스케줄링 (옵션)]
```

## 핵심 컴포넌트 설계

### 1. ClockView (시계형 UI)

```typescript
// components/ClockView.tsx
interface ClockViewProps {
  schedules: Schedule[];
  onEventPress: (schedule: Schedule) => void;
  onTimePress: (time: string) => void;
}

// 역할:
// - 24시간 원형 시계판 렌더링
// - 각 일정을 아크(arc)로 표시
// - 터치 이벤트로 시간대 선택 지원
```

**시간 → 각도 변환 공식**:

```typescript
// utils/timeUtils.ts
function timeToAngle(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  // 12시 방향을 0도로 설정 (위쪽)
  return (totalMinutes / 1440) * 360 - 90;
}
```

### 2. EventArc (일정 아크)

```typescript
// components/EventArc.tsx
interface EventArcProps {
  schedule: Schedule;
  radius: number;
  strokeWidth: number;
  onPress: () => void;
}

// React Native SVG의 Path를 사용하여 아크 그리기
// d 속성: M (시작점) → A (호) → L (끝점)
```

### 3. scheduleStore (상태 관리)

```typescript
// store/scheduleStore.ts
interface ScheduleStore {
  schedules: Schedule[];
  
  // Actions
  addSchedule: (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSchedule: (id: string, updates: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  loadSchedules: () => Promise<void>;
  
  // Computed
  getSchedulesByTime: (time: string) => Schedule[];
}

// Zustand persist middleware로 AsyncStorage 자동 동기화
```

## 화면 구성

### 1. 메인 화면 (app/(tabs)/index.tsx)

- 중앙: 24시간 원형 시계
- 시계 위: 현재 시간 표시
- 하단: "+ 일정 추가" 버튼
- 일정 터치 시: 편집 모달 열기

### 2. 리스트 화면 (app/(tabs)/list.tsx)

- 시간순 정렬된 일정 목록
- 각 아이템: 시간대, 제목, 카테고리 표시
- 스와이프로 삭제
- 터치로 편집

### 3. 일정 모달 (app/modal.tsx)

- 제목 입력
- 시작/종료 시간 선택 (TimePicker)
- 카테고리 선택
- 알림 토글
- 저장/취소 버튼

## 알림 처리

```typescript
// utils/notifications.ts

// 1. 권한 요청
async function requestPermissions(): Promise<boolean>

// 2. 알림 스케줄링
async function scheduleNotification(schedule: Schedule): Promise<string>

// 3. 알림 취소
async function cancelNotification(notificationId: string): Promise<void>

// 4. 모든 알림 재스케줄링 (앱 시작 시)
async function rescheduleAll(schedules: Schedule[]): Promise<void>
```

## 성능 최적화

### 1. 메모이제이션

```typescript
// ClockView에서 불필요한 리렌더링 방지
const MemoizedEventArc = React.memo(EventArc);
```

### 2. 가상화

```typescript
// 리스트 화면에서 FlatList 사용
<FlatList
  data={schedules}
  renderItem={renderEventItem}
  keyExtractor={(item) => item.id}
  windowSize={5}
/>
```

### 3. Reanimated

```typescript
// 드래그 제스처에 Reanimated 사용 (향후 확장)
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
```

## 확장 계획

### Phase 1 (MVP)
- ✅ 시계형 UI
- ✅ 일정 CRUD
- ✅ 로컬 저장
- ✅ 기본 알림

### Phase 2 (향후)
- ☐ 드래그로 시간 조정
- ☐ 반복 일정 (매일, 매주)
- ☐ 다크 모드
- ☐ 위젯 지원

### Phase 3 (확장)
- ☐ 클라우드 동기화 (Firebase)
- ☐ 캘린더 연동 (Google, Apple)
- ☐ 통계 및 시간 분석
- ☐ 커스텀 카테고리

## 핵심 상수

```typescript
// constants/Clock.ts
export const CLOCK_CONFIG = {
  RADIUS: 140,              // 시계 반지름 (px)
  STROKE_WIDTH: 20,         // 일정 아크 두께 (px)
  CENTER_RADIUS: 50,        // 중앙 원 반지름 (px)
  HOUR_MARK_LENGTH: 10,     // 시간 눈금 길이 (px)
  TOTAL_HOURS: 24,          // 24시간제
  ANIMATION_DURATION: 300,  // 애니메이션 시간 (ms)
};
```

## 테스트 전략

### 단위 테스트
- `timeUtils.ts`: 시간 ↔ 각도 변환 로직
- `colorUtils.ts`: 색상 할당 로직
- `scheduleStore.ts`: 상태 관리 로직

### 통합 테스트
- 일정 추가 → 저장 → 불러오기 플로우
- 알림 스케줄링 → 트리거 확인

### E2E 테스트 (선택)
- Detox 사용 고려 (시간이 있을 경우)
