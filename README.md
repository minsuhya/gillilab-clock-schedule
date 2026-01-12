# ClockPlan - 시계형 하루 일정 관리 앱

24시간 시계 UI로 직관적으로 관리하는 하루 일정 앱

## 개요

**프로젝트명**: clock-schedule  
**서비스명**: ClockPlan  
**타겟**: 시간 관리가 필요한 직장인, 학생  
**플랫폼**: iOS, Android (Expo/React Native)

## 핵심 기능

- 🕐 **시계형 UI**: 24시간 원형 시계에서 일정을 시각적으로 표시
- ✏️ **일정 추가/편집**: 터치로 시간대 선택 후 일정 생성
- 🎨 **시간대별 색상 구분**: 일정 카테고리별 색상 자동 할당
- 🖱️ **드래그 조정**: 일정을 드래그하여 시간 조정
- 🔔 **알림 기능**: 일정 시작 전 푸시 알림

## 기술 스택

- **Frontend**: React Native (Expo)
- **상태 관리**: Zustand
- **로컬 저장소**: AsyncStorage
- **UI**: React Native SVG (시계 그리기)
- **알림**: expo-notifications

## 시작하기

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npx expo start
```

### 실행

```bash
# iOS 시뮬레이터
npx expo run:ios

# Android 에뮬레이터
npx expo run:android
```

## 프로젝트 구조

```
clock-schedule/
├── app/                    # Expo Router 페이지
│   ├── (tabs)/
│   │   ├── index.tsx      # 메인 시계 화면
│   │   └── list.tsx       # 일정 리스트 화면
│   └── _layout.tsx
├── components/            # 재사용 컴포넌트
│   ├── ClockView.tsx     # 시계형 UI 컴포넌트
│   ├── EventItem.tsx     # 일정 아이템
│   └── EventModal.tsx    # 일정 추가/편집 모달
├── store/                # Zustand 스토어
│   └── scheduleStore.ts
├── types/                # TypeScript 타입
│   └── index.ts
└── utils/                # 유틸리티 함수
    ├── timeUtils.ts      # 시간 변환 함수
    └── colorUtils.ts     # 색상 할당 함수
```

## 데이터 모델

```typescript
interface Schedule {
  id: string;
  title: string;
  startTime: string;    // HH:mm 형식
  endTime: string;      // HH:mm 형식
  category: string;
  color: string;
  notificationEnabled: boolean;
}
```

## 개발 가이드

상세한 아키텍처 및 구현 가이드는 [docs/architecture.md](docs/architecture.md)를 참고하세요.

## MVP 범위

✅ 포함:
- 시계형 UI로 일정 표시
- 일정 CRUD (추가, 조회, 수정, 삭제)
- 로컬 저장 (AsyncStorage)
- 기본 알림 기능
- 5개 기본 카테고리

❌ 제외 (향후 확장):
- 클라우드 동기화
- 반복 일정
- 캘린더 연동
- 통계/분석 기능

## 라이선스

MIT
