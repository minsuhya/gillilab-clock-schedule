# ClockPlan 구현 문서

## 프로젝트 개요

**프로젝트명**: ClockPlan (clock-schedule)  
**구현 날짜**: 2026년 1월 13일  
**구현 상태**: ✅ MVP 완료 (프로덕션 준비 상태)

24시간 원형 시계 UI로 하루 일정을 직관적으로 관리하는 React Native 앱

---

## 기술 스택

### Core

- **Framework**: Expo SDK 54 (React Native 0.81.5)
- **Language**: TypeScript 5.9.2
- **UI Library**: React 19.1.0
- **Router**: Expo Router 6.0.21

### State & Storage

- **State Management**: Zustand 5.0.10 (with persist middleware)
- **Local Storage**: @react-native-async-storage/async-storage 2.2.0

### UI Components

- **Graphics**: react-native-svg 15.15.1 (시계 렌더링)
- **Date Picker**: @react-native-community/datetimepicker 8.6.0
- **Animations**: react-native-reanimated 4.1.1, react-native-gesture-handler 2.30.0

### Features

- **Notifications**: expo-notifications 0.32.16

### Testing

- **Test Framework**: Jest 30.2.0
- **Preset**: jest-expo 54.0.16
- **TypeScript Support**: ts-jest 29.4.6

---

## 프로젝트 구조

```
clock-schedule/
├── app/                          # Expo Router 페이지
│   ├── (tabs)/
│   │   ├── _layout.tsx          # 탭 네비게이션 설정
│   │   ├── index.tsx            # 메인 시계 화면
│   │   └── two.tsx              # 일정 리스트 화면
│   ├── _layout.tsx              # 루트 레이아웃
│   └── modal.tsx                # 일정 추가/편집 모달
│
├── components/                   # UI 컴포넌트 (7개)
│   ├── CategoryPicker.tsx       # 카테고리 선택 라디오 버튼
│   ├── ClockFace.tsx            # 24시간 시계 베이스 (눈금, 중앙 원)
│   ├── ClockView.tsx            # 시계 + 일정 호 통합 컴포넌트
│   ├── EventArc.tsx             # 일정 시각화 호(arc) SVG
│   ├── EventItem.tsx            # 리스트 아이템 카드
│   ├── EventList.tsx            # 일정 리스트 (FlatList)
│   └── TimeSelector.tsx         # 시간 선택 피커 래퍼
│
├── store/
│   └── scheduleStore.ts         # Zustand 스토어 (CRUD + persist)
│
├── types/
│   └── index.ts                 # TypeScript 인터페이스 정의
│
├── utils/                        # 유틸리티 함수 (5개)
│   ├── colorUtils.ts            # 카테고리 색상 매핑
│   ├── notifications.ts         # 푸시 알림 스케줄링
│   ├── scheduleUtils.ts         # 일정 중복 체크, 정렬
│   ├── storage.ts               # AsyncStorage 래퍼
│   └── timeUtils.ts             # 시간 ↔ 각도 변환 (핵심 로직)
│
├── constants/                    # 상수 정의 (5개)
│   ├── AppColors.ts             # 앱 전역 색상 팔레트
│   ├── Categories.ts            # 기본 카테고리 5개 정의
│   ├── Clock.ts                 # 시계 UI 설정값
│   ├── Colors.ts                # 테마 색상
│   └── Storage.ts               # AsyncStorage 키
│
├── __tests__/
│   └── timeUtils.test.ts        # 단위 테스트 (19개 통과)
│
├── docs/                         # 문서
│   ├── architecture.md          # 아키텍처 설계 문서
│   └── features.md              # 기능 명세서
│
├── app.json                      # Expo 설정
├── package.json                  # 의존성 목록
├── tsconfig.json                 # TypeScript 설정
└── jest.config.js                # Jest 설정
```

---

## 구현 단계별 요약

### Phase 1: 프로젝트 초기화 ✅

**작업 내용:**

- Expo 프로젝트 생성 (tabs 템플릿)
- 의존성 설치 (Zustand, AsyncStorage, SVG, Notifications 등)
- 폴더 구조 생성 (types, store, utils, constants)

**결과:**

- 프로젝트 베이스 완성
- 모든 필수 라이브러리 설치 완료

---

### Phase 2: Core Logic 구현 ✅

**작업 내용:**

#### 1. TypeScript 타입 정의 (`types/index.ts`)

```typescript
interface Schedule {
  id: string;
  title: string;
  startTime: string; // "HH:mm" 형식
  endTime: string; // "HH:mm" 형식
  category: CategoryType;
  color: string;
  notificationEnabled: boolean;
  notificationId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

type CategoryType = "work" | "personal" | "exercise" | "study" | "meeting";
```

#### 2. 상수 정의 (5개 파일)

- **Clock.ts**: 시계 UI 설정 (반지름 140, 선 굵기 20 등)
- **Categories.ts**: 기본 카테고리 5개 (업무, 개인, 운동, 공부, 미팅)
- **AppColors.ts**: 앱 색상 팔레트
- **Storage.ts**: AsyncStorage 키 (`@clockplan:schedules`)

#### 3. 유틸리티 함수 (5개 파일)

**timeUtils.ts** - 시계 핵심 로직:

```typescript
// 시간 → 각도 변환 (12시 = -90도 기준)
function timeToAngle(time: string): number;

// 각도 → 시간 변환
function angleToTime(angle: number): string;

// 시간 → 분 변환 (00:00 = 0분, 23:59 = 1439분)
function timeToMinutes(time: string): number;

// 분 → 시간 변환
function minutesToTime(minutes: number): string;

// 시간 형식 유효성 검사 (HH:mm)
function isValidTime(time: string): boolean;

// 종료 시간 > 시작 시간 검증
function isEndTimeValid(start: string, end: string): boolean;
```

**notifications.ts** - 알림 시스템:

```typescript
// 권한 요청
async function requestPermissions(): Promise<boolean>;

// 알림 스케줄링
async function scheduleNotification(schedule: Schedule): Promise<string | null>;

// 알림 취소
async function cancelNotification(notificationId: string): Promise<void>;
```

**scheduleUtils.ts** - 일정 관리:

```typescript
// 일정 중복 체크
function hasOverlap(schedule: Schedule, schedules: Schedule[]): boolean;

// 시간순 정렬
function sortSchedulesByTime(schedules: Schedule[]): Schedule[];
```

#### 4. Zustand Store (`store/scheduleStore.ts`)

```typescript
interface ScheduleStore {
  schedules: Schedule[];
  addSchedule: (schedule: ScheduleInput) => Promise<void>;
  updateSchedule: (id: string, updates: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  getScheduleById: (id: string) => Schedule | undefined;
}
```

**특징:**

- Zustand persist middleware로 AsyncStorage 자동 동기화
- 알림 스케줄링/취소 자동 처리
- UUID로 고유 ID 생성
- createdAt/updatedAt 자동 관리

---

### Phase 3: UI 컴포넌트 구현 ✅

**작업 내용:**

#### 1. ClockFace.tsx - 시계 베이스

- SVG로 24시간 원형 시계 그리기
- 24개 눈금 (1시간 간격)
- 중앙 원형 장식
- 크기: 반지름 140, 중심 (150, 150)

#### 2. EventArc.tsx - 일정 시각화 호

- SVG Path로 호(arc) 그리기
- 시작/종료 시간을 각도로 변환하여 렌더링
- 카테고리별 색상 적용
- 터치 이벤트로 편집 모달 열기

#### 3. ClockView.tsx - 통합 시계 컴포넌트

- ClockFace + EventArc 조합
- schedules 배열을 받아 모든 일정 표시
- 일정 클릭 시 onEventPress 콜백

#### 4. CategoryPicker.tsx - 카테고리 선택

- 5개 카테고리 라디오 버튼
- 아이콘 + 이름 표시
- 선택된 항목 하이라이트

#### 5. TimeSelector.tsx - 시간 선택

- @react-native-community/datetimepicker 래퍼
- iOS/Android 네이티브 피커 사용
- HH:mm 형식으로 반환

#### 6. EventItem.tsx - 리스트 아이템

- 카테고리 색상 좌측 바
- 제목, 시간, 카테고리 표시
- 터치로 편집 모달 열기

#### 7. EventList.tsx - 일정 리스트

- FlatList로 최적화
- 빈 상태 메시지 ("일정이 없습니다")
- 시간순 정렬

---

### Phase 4: 화면 구현 ✅

**작업 내용:**

#### 1. app/(tabs)/index.tsx - 메인 시계 화면

```typescript
// 구성 요소:
- 현재 시간 표시 (useEffect로 1분마다 업데이트)
- ClockView 컴포넌트 (중앙)
- "일정 추가" 버튼 (하단)

// 동작:
- 호(arc) 클릭 → 편집 모달 (router.push)
- 일정 추가 버튼 → 추가 모달
```

#### 2. app/(tabs)/two.tsx - 리스트 화면

```typescript
// 구성 요소:
- "N개의 일정" 헤더
- EventList 컴포넌트
- 빈 상태 처리

// 동작:
- 리스트 아이템 클릭 → 편집 모달
```

#### 3. app/modal.tsx - 추가/편집 모달

```typescript
// 폼 필드:
- 제목 입력 (TextInput)
- 시작 시간 선택 (TimeSelector)
- 종료 시간 선택 (TimeSelector)
- 카테고리 선택 (CategoryPicker)
- 알림 토글 (Switch)

// 유효성 검사:
- 제목 필수
- 종료 시간 > 시작 시간
- 일정 중복 경고 (저장은 허용)

// 버튼:
- 저장 (추가 모드) / 수정 (편집 모드)
- 삭제 (편집 모드만)
- 취소
```

#### 4. app/(tabs)/\_layout.tsx - 탭 네비게이션

```typescript
// 탭 설정:
- 첫 번째 탭: "시계" (clock-o 아이콘)
- 두 번째 탭: "목록" (list 아이콘)
```

---

### Phase 5: 테스트 및 검증 ✅

**작업 내용:**

#### 1. 단위 테스트 작성 (`__tests__/timeUtils.test.ts`)

```
✅ timeToAngle - 5개 테스트
  - 00:00 → -90도
  - 06:00 → 0도
  - 12:00 → 90도
  - 18:00 → 180도
  - 23:59 → ~270도

✅ angleToTime - 4개 테스트
  - -90도 → 00:00
  - 0도 → 06:00
  - 90도 → 12:00
  - 180도 → 18:00

✅ timeToMinutes - 3개 테스트
✅ minutesToTime - 3개 테스트
✅ isValidTime - 2개 테스트
✅ isEndTimeValid - 2개 테스트

총 19개 테스트 - 전부 통과 ✅
```

#### 2. TypeScript 컴파일 검증

```bash
npx tsc --noEmit
# 결과: 에러 없음 ✅
```

#### 3. 빌드 테스트

```bash
npx expo export --platform all
# 결과:
# ✅ iOS 번들: 9.0 MB (1,701 modules)
# ✅ Android 번들: 9.0 MB (1,705 modules)
# ✅ Web 번들: 3.08 MB (1,294 modules)
# ✅ 7개 정적 페이지 생성
```

#### 4. Jest 설정

```javascript
// jest.config.js
module.exports = {
  preset: "jest-expo",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
};
```

#### 5. 알림 플러그인 추가 (app.json)

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ]
  }
}
```

---

## 핵심 기능 상세

### 1. 24시간 시계 렌더링

**원리:**

- SVG Circle로 외곽선 그리기
- 24개 Line으로 시간 눈금 표시
- 각 일정을 SVG Path로 호(arc) 그리기

**각도 변환 로직:**

```typescript
// 12시(0시) 방향을 -90도로 설정 (SVG 기준 3시 방향이 0도)
const angle = (totalMinutes / 1440) * 360 - 90;

// 예시:
// 00:00 → 0분 → -90도 (12시 방향)
// 06:00 → 360분 → 0도 (3시 방향)
// 12:00 → 720분 → 90도 (6시 방향)
// 18:00 → 1080분 → 180도 (9시 방향)
```

### 2. 일정 CRUD

**추가:**

```typescript
addSchedule(schedule) {
  1. UUID로 고유 ID 생성
  2. createdAt/updatedAt 타임스탬프 추가
  3. 알림 활성화 시 scheduleNotification() 호출
  4. Zustand state 업데이트
  5. AsyncStorage 자동 저장 (persist middleware)
}
```

**수정:**

```typescript
updateSchedule(id, updates) {
  1. 기존 일정 찾기
  2. 알림 설정 변경 시:
     - 기존 알림 취소
     - 새 알림 스케줄링
  3. updatedAt 타임스탬프 업데이트
  4. Zustand state 업데이트
}
```

**삭제:**

```typescript
deleteSchedule(id) {
  1. notificationId가 있으면 알림 취소
  2. schedules 배열에서 제거
  3. AsyncStorage 자동 업데이트
}
```

### 3. 일정 중복 체크

```typescript
function hasOverlap(newSchedule, existingSchedules) {
  // 시간을 분으로 변환하여 비교
  const newStart = timeToMinutes(newSchedule.startTime);
  const newEnd = timeToMinutes(newSchedule.endTime);

  for (const schedule of existingSchedules) {
    if (schedule.id === newSchedule.id) continue; // 자기 자신 제외

    const existingStart = timeToMinutes(schedule.startTime);
    const existingEnd = timeToMinutes(schedule.endTime);

    // 겹침 조건: (새 시작 < 기존 종료) AND (새 종료 > 기존 시작)
    if (newStart < existingEnd && newEnd > existingStart) {
      return true;
    }
  }

  return false;
}
```

### 4. 알림 시스템

```typescript
async function scheduleNotification(schedule) {
  // 1. 권한 확인
  const hasPermission = await requestPermissions();
  if (!hasPermission) return null;

  // 2. 시작 시간 10분 전으로 설정
  const [hours, minutes] = schedule.startTime.split(":").map(Number);
  const notificationTime = new Date();
  notificationTime.setHours(hours, minutes - 10, 0);

  // 3. 알림 스케줄링
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: schedule.title,
      body: `${schedule.startTime} - ${schedule.endTime}`,
      data: { scheduleId: schedule.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: notificationTime,
      channelId: "schedule-reminders",
    },
  });

  return notificationId;
}
```

### 5. AsyncStorage 영속성

```typescript
// Zustand persist middleware 사용
export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      schedules: [],
      // actions...
    }),
    {
      name: "@clockplan:schedules",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// 자동으로:
// - state 변경 시 AsyncStorage에 저장
// - 앱 재시작 시 AsyncStorage에서 복원
```

---

## 데이터 모델 전체

### Schedule (일정)

```typescript
interface Schedule {
  id: string; // UUID v4
  title: string; // 일정 제목
  startTime: string; // "HH:mm" 형식 (예: "09:00")
  endTime: string; // "HH:mm" 형식 (예: "10:30")
  category: CategoryType; // 카테고리 ID
  color: string; // 16진수 색상 (예: "#3B82F6")
  notificationEnabled: boolean; // 알림 활성화 여부
  notificationId?: string; // expo-notifications ID
  createdAt: string; // ISO 8601 (예: "2026-01-13T00:00:00.000Z")
  updatedAt: string; // ISO 8601
}
```

### Category (카테고리)

```typescript
interface Category {
  id: string; // 'work', 'personal', 'exercise', 'study', 'meeting'
  name: string; // 한글 이름 (예: "업무")
  color: string; // 16진수 색상
  icon: string; // 이모지 (예: "💼")
}

// 기본 카테고리 5개:
const DEFAULT_CATEGORIES: Category[] = [
  { id: "work", name: "업무", color: "#3B82F6", icon: "💼" },
  { id: "personal", name: "개인", color: "#10B981", icon: "🏠" },
  { id: "exercise", name: "운동", color: "#EF4444", icon: "🏃" },
  { id: "study", name: "공부", color: "#8B5CF6", icon: "📚" },
  { id: "meeting", name: "미팅", color: "#F59E0B", icon: "🤝" },
];
```

### ClockConfig (시계 설정)

```typescript
interface ClockConfig {
  RADIUS: number; // 140 (시계 반지름)
  STROKE_WIDTH: number; // 20 (호의 두께)
  CENTER_RADIUS: number; // 50 (중앙 원 반지름)
  HOUR_MARK_LENGTH: number; // 10 (눈금 길이)
  TOTAL_HOURS: number; // 24 (24시간 시계)
}
```

---

## 주요 알고리즘

### 1. SVG Arc Path 생성

```typescript
function createArcPath(
  startAngle: number,
  endAngle: number,
  radius: number,
  centerX: number = 150,
  centerY: number = 150,
): string {
  // 각도를 라디안으로 변환
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  // 시작점 좌표
  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);

  // 종료점 좌표
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);

  // 큰 호 플래그 (180도 이상이면 1)
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  // SVG Path 명령
  return `
    M ${x1} ${y1}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
  `;
}
```

### 2. 시간 정규화

```typescript
function normalizeTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);

  // 24시간 넘어가면 다음날로 처리
  const normalizedHours = hours % 24;
  const normalizedMinutes = minutes % 60;

  return `${String(normalizedHours).padStart(2, "0")}:${String(normalizedMinutes).padStart(2, "0")}`;
}
```

---

## 테스트 커버리지

### 단위 테스트 (Jest)

```
파일: __tests__/timeUtils.test.ts
상태: ✅ 19/19 통과

세부 항목:
├── timeToAngle (5개 테스트)
│   ├── ✅ 00:00 → -90도
│   ├── ✅ 06:00 → 0도
│   ├── ✅ 12:00 → 90도
│   ├── ✅ 18:00 → 180도
│   └── ✅ 23:59 → ~270도
│
├── angleToTime (4개 테스트)
│   ├── ✅ -90도 → 00:00
│   ├── ✅ 0도 → 06:00
│   ├── ✅ 90도 → 12:00
│   └── ✅ 180도 → 18:00
│
├── timeToMinutes (3개 테스트)
│   ├── ✅ 00:00 → 0분
│   ├── ✅ 09:30 → 570분
│   └── ✅ 23:59 → 1439분
│
├── minutesToTime (3개 테스트)
│   ├── ✅ 0분 → 00:00
│   ├── ✅ 570분 → 09:30
│   └── ✅ 1439분 → 23:59
│
├── isValidTime (2개 테스트)
│   ├── ✅ 유효한 형식 ("09:30", "00:00", "23:59")
│   └── ✅ 유효하지 않은 형식 ("9:30", "25:00", "abc")
│
└── isEndTimeValid (2개 테스트)
    ├── ✅ 종료 > 시작 ("09:00" < "10:00")
    └── ✅ 종료 ≤ 시작 ("10:00" < "09:00", "09:00" = "09:00")
```

### 빌드 테스트

```
명령: npx expo export --platform all
결과: ✅ 성공

출력:
├── iOS 번들: 9.0 MB (1,701 modules) - 6.7초
├── Android 번들: 9.0 MB (1,705 modules) - 6.6초
├── Web 번들: 3.08 MB (1,294 modules) - 7.2초
└── 정적 페이지: 7개 (/, /two, /modal, /_sitemap 등)

경고:
- "shadow*" deprecated → 웹 전용, 네이티브 영향 없음
- expo-notifications 웹 미지원 → 예상된 동작
```

### TypeScript 컴파일

```
명령: npx tsc --noEmit
결과: ✅ 에러 없음 (템플릿 파일 제외)

검증된 파일:
├── types/index.ts
├── constants/*.ts (5개)
├── utils/*.ts (5개)
├── store/scheduleStore.ts
├── components/*.tsx (7개)
└── app/**/*.tsx (3개 화면)
```

---

## 설치 및 실행

### 환경 요구사항

- Node.js 18 이상
- npm 또는 yarn
- iOS: Xcode 14 이상, macOS
- Android: Android Studio, JDK 17

### 초기 설정

```bash
# 1. 프로젝트 디렉토리로 이동
cd /Volumes/ssd/Work/01.projects/gillilab-opencode/clock-schedule

# 2. 의존성 설치
npm install

# 3. iOS CocoaPods 설치 (iOS만 해당)
npx pod-install
```

### 개발 서버 실행

```bash
# Expo 개발 서버 시작
npx expo start

# 옵션:
# -c : 캐시 클리어
# --clear : Metro bundler 캐시 삭제
# --ios : iOS 시뮬레이터 자동 실행
# --android : Android 에뮬레이터 자동 실행
```

### 플랫폼별 실행

```bash
# iOS 시뮬레이터
npx expo run:ios

# Android 에뮬레이터
npx expo run:android

# 웹 브라우저
npx expo start --web
```

### 실제 디바이스 테스트

1. Expo Go 앱 설치 (App Store / Google Play)
2. 개발 서버 QR 코드 스캔
3. 앱 자동 로드

### 테스트 실행

```bash
# 단위 테스트
npm test

# Watch 모드
npm run test:watch

# TypeScript 타입 체크
npx tsc --noEmit

# 빌드 테스트
npx expo export --platform all
```

---

## 주요 명령어

### 개발

```bash
npm start              # 개발 서버 시작
npm run ios            # iOS 실행
npm run android        # Android 실행
npm run web            # 웹 실행
npm test               # 테스트 실행
```

### 빌드

```bash
npx expo export        # 프로덕션 빌드
npx eas build          # EAS Build (클라우드)
npx expo prebuild      # 네이티브 코드 생성
```

### 유지보수

```bash
npx expo install --check    # 의존성 버전 체크
npx expo doctor             # 프로젝트 진단
npx expo start --clear      # 캐시 삭제 후 시작
```

---

## 트러블슈팅

### 문제 1: Metro bundler 캐시 에러

```bash
# 해결:
rm -rf node_modules
npm install
npx expo start --clear
```

### 문제 2: iOS 빌드 실패

```bash
# 해결:
cd ios
pod install
cd ..
npx expo run:ios
```

### 문제 3: Android 에뮬레이터 연결 안 됨

```bash
# 해결:
adb devices                   # 디바이스 확인
adb kill-server && adb start-server
npx expo run:android
```

### 문제 4: TypeScript 경로 alias 인식 안 됨

```bash
# 해결:
# tsconfig.json 확인:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# Metro 재시작
npx expo start --clear
```

### 문제 5: AsyncStorage 데이터 초기화

```typescript
// 개발 중 데이터 삭제가 필요할 때:
import AsyncStorage from "@react-native-async-storage/async-storage";

AsyncStorage.removeItem("@clockplan:schedules");
```

---

## 성능 최적화

### 현재 구현

1. **FlatList**: 일정 리스트 가상화 (EventList.tsx)
2. **React.memo**: 컴포넌트 불필요한 리렌더링 방지 (EventArc, EventItem)
3. **Zustand**: 최소한의 리렌더링 (선택적 구독)
4. **AsyncStorage**: 백그라운드 저장 (persist middleware)

### 향후 개선 사항

1. **useMemo**: 비싼 계산 캐싱 (각도 변환, 정렬)
2. **useCallback**: 이벤트 핸들러 메모이제이션
3. **React Native Reanimated**: 호 애니메이션
4. **Virtualization**: 많은 일정 처리 (100개 이상)

---

## 보안 고려사항

### 현재 구현

- ✅ 로컬 저장만 사용 (AsyncStorage)
- ✅ 민감 정보 없음 (일정 제목만 저장)
- ✅ 알림 권한 명시적 요청

### 향후 확장 시

- [ ] 클라우드 동기화: HTTPS, 토큰 인증
- [ ] 사용자 데이터: 암호화 저장
- [ ] API 통신: JWT, refresh token

---

## 알려진 제한사항

### 현재 버전 (MVP)

1. **단일 날짜**: 하루 일정만 관리 (멀티데이 미지원)
2. **반복 일정 없음**: 매일/매주 반복 불가
3. **자정 넘어가는 일정**: 23:00-01:00 같은 일정 미지원
4. **동시 편집 없음**: 멀티 디바이스 동기화 없음
5. **오프라인 전용**: 클라우드 백업 없음

### 향후 개선 계획

- Phase 2: 반복 일정, 자정 넘어가는 일정
- Phase 3: 클라우드 동기화, 멀티 디바이스
- Phase 4: 통계, 캘린더 연동, 위젯

---

## 의존성 목록

### Core Dependencies

```json
{
  "@expo/vector-icons": "^15.0.3",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@react-native-community/datetimepicker": "^8.6.0",
  "@react-navigation/native": "^7.1.8",
  "expo": "~54.0.31",
  "expo-constants": "~18.0.13",
  "expo-font": "~14.0.10",
  "expo-linking": "~8.0.11",
  "expo-notifications": "^0.32.16",
  "expo-router": "~6.0.21",
  "expo-splash-screen": "~31.0.13",
  "expo-status-bar": "~3.0.9",
  "expo-web-browser": "~15.0.10",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "react-native": "0.81.5",
  "react-native-gesture-handler": "^2.30.0",
  "react-native-reanimated": "~4.1.1",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0",
  "react-native-svg": "^15.15.1",
  "react-native-web": "~0.21.0",
  "zustand": "^5.0.10"
}
```

### Dev Dependencies

```json
{
  "@types/jest": "^30.0.0",
  "@types/react": "~19.1.0",
  "jest": "^30.2.0",
  "jest-expo": "^54.0.16",
  "react-test-renderer": "19.1.0",
  "ts-jest": "^29.4.6",
  "typescript": "~5.9.2"
}
```

---

## 코드 스타일 가이드

### TypeScript

- **Strict Mode**: 엄격한 타입 체크
- **Explicit Types**: 함수 반환 타입 명시
- **Interface over Type**: 객체 형태는 interface 사용
- **No Any**: any 타입 금지

### Naming

- **Components**: PascalCase (ClockView.tsx)
- **Functions**: camelCase (timeToAngle)
- **Constants**: UPPER_SNAKE_CASE (CLOCK_CONFIG)
- **Interfaces**: PascalCase (Schedule)
- **Props**: {ComponentName}Props (ClockViewProps)

### File Organization

```typescript
// 1. Imports (React → Libraries → Internal)
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useScheduleStore } from '@/store/scheduleStore';
import { timeToAngle } from '@/utils/timeUtils';

// 2. Types
interface ComponentProps { }

// 3. Component
export const Component: React.FC<ComponentProps> = (props) => {
  // 3.1. Hooks
  const [state, setState] = useState();

  // 3.2. Derived values
  const derivedValue = useMemo(() => { }, []);

  // 3.3. Handlers
  const handlePress = () => { };

  // 3.4. Render
  return <View />;
};
```

---

## 라이선스

MIT License

---

## 문서 히스토리

- **2026-01-13**: 초기 구현 완료 및 문서 작성
- **버전**: 1.0.0 (MVP)
- **상태**: 프로덕션 준비 완료

---

## 참고 문서

- [docs/architecture.md](./docs/architecture.md) - 아키텍처 설계 문서
- [docs/features.md](./docs/features.md) - 기능 명세서
- [AGENTS.md](./AGENTS.md) - AI 에이전트 개발 가이드
- [README.md](./README.md) - 프로젝트 개요

---

## 연락처

프로젝트 관련 문의:

- GitHub: [저장소 URL]
- Email: [이메일]

---

**문서 작성일**: 2026년 1월 13일  
**문서 버전**: 1.0.0  
**프로젝트 상태**: ✅ MVP 완료
