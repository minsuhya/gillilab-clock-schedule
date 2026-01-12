# 기능 명세

## MVP 기능 목록

### 1. 시계형 UI 표시

**설명**: 24시간을 원형 시계로 표시하고, 등록된 일정을 시간대별 색상 아크로 시각화

**UI 요소**:
- 24시간 원형 시계판
- 시간 눈금 (0시, 6시, 12시, 18시 강조)
- 현재 시간 표시 (중앙 또는 상단)
- 일정 아크 (각도로 시간 표현)

**동작**:
- 앱 시작 시 현재 시간으로 자동 스크롤
- 빈 시간대 터치 → 일정 추가 모달
- 일정 아크 터치 → 일정 상세/편집 모달

**기술**:
- React Native SVG
- `timeToAngle()` 함수로 시간 → 각도 변환
- `Path` 컴포넌트로 아크 그리기

---

### 2. 일정 추가

**입력 필드**:
- 제목 (필수, 최대 50자)
- 시작 시간 (HH:mm)
- 종료 시간 (HH:mm)
- 카테고리 (5개 중 선택)
- 알림 여부 (토글)

**유효성 검사**:
- 제목이 비어있으면 저장 불가
- 종료 시간이 시작 시간보다 빠르면 에러
- 시간 중복 시 경고 (저장은 가능)

**동작**:
1. "+ 일정 추가" 버튼 또는 빈 시간대 터치
2. 모달 열림
3. 정보 입력 후 "저장" 버튼
4. `scheduleStore.addSchedule()` 호출
5. AsyncStorage에 자동 저장
6. 알림 활성화 시 notification 스케줄링
7. 모달 닫힘 → 시계 화면에 아크 표시

---

### 3. 일정 조회

**시계 화면**:
- 모든 일정을 시간대별 아크로 표시
- 아크 색상 = 카테고리 색상
- 중첩 일정은 겹쳐서 표시 (투명도 조정)

**리스트 화면**:
- 시간순 정렬 (오름차순)
- 각 아이템 표시 내용:
  - 카테고리 아이콘 + 이름
  - 시간대 (예: "09:00 - 10:30")
  - 제목
  - 알림 아이콘 (활성화 시)

**필터 (향후 확장)**:
- 카테고리별 필터
- 오늘/내일 전환

---

### 4. 일정 수정

**진입 방법**:
- 시계 화면에서 아크 터치
- 리스트 화면에서 아이템 터치

**동작**:
1. 기존 정보가 미리 채워진 모달 열림
2. 원하는 필드 수정
3. "저장" 버튼
4. `scheduleStore.updateSchedule()` 호출
5. 알림 재스케줄링 (필요 시)
6. 화면 업데이트

**제약**:
- ID는 변경 불가
- 수정 시에도 유효성 검사 동일 적용

---

### 5. 일정 삭제

**방법 1: 리스트 화면에서 스와이프**
```typescript
// 좌측 스와이프 시 삭제 버튼 노출
<Swipeable
  renderRightActions={() => <DeleteButton />}
  onSwipeableOpen={() => handleDelete(schedule.id)}
>
  <EventItem />
</Swipeable>
```

**방법 2: 편집 모달에서 "삭제" 버튼**
- 확인 Alert 표시
- 확인 시 `scheduleStore.deleteSchedule()` 호출

**동작**:
1. 삭제 확인 Alert
2. 확인 → AsyncStorage에서 제거
3. 알림 취소 (있을 경우)
4. 화면에서 아크/아이템 제거

---

### 6. 카테고리 시스템

**기본 카테고리 (5개)**:

| ID | 이름 | 색상 | 아이콘 |
|----|------|------|--------|
| work | 업무 | #3B82F6 (파랑) | 💼 |
| personal | 개인 | #10B981 (초록) | 🏠 |
| exercise | 운동 | #EF4444 (빨강) | 🏃 |
| study | 공부 | #8B5CF6 (보라) | 📚 |
| meeting | 미팅 | #F59E0B (주황) | 🤝 |

**선택 UI**:
- 라디오 버튼 또는 칩 형태
- 선택한 카테고리의 색상으로 프리뷰 표시

**확장 가능성**:
- Phase 2에서 커스텀 카테고리 추가 기능

---

### 7. 알림 기능

**알림 시점**:
- 일정 시작 시간 정확히 (예: 09:00 일정 → 09:00 알림)
- 향후 확장: 5분 전, 10분 전 옵션

**알림 내용**:
```
제목: [카테고리 아이콘] 일정 시작
본문: [일정 제목]
시간: [시작시간] - [종료시간]
```

**권한 처리**:
```typescript
// 앱 시작 시 권한 요청
useEffect(() => {
  requestNotificationPermissions();
}, []);
```

**제약**:
- iOS/Android 권한 필요
- 앱이 종료되어도 알림 작동
- 일정 수정/삭제 시 알림 자동 업데이트

---

### 8. 로컬 저장소

**저장 키**:
```typescript
const STORAGE_KEYS = {
  SCHEDULES: '@clockplan:schedules',
  SETTINGS: '@clockplan:settings',
};
```

**저장 시점**:
- 일정 추가/수정/삭제 시 자동 저장 (Zustand persist)
- 앱 시작 시 자동 로드

**데이터 구조**:
```json
{
  "schedules": [
    {
      "id": "uuid-1234",
      "title": "회의",
      "startTime": "09:00",
      "endTime": "10:00",
      "category": "meeting",
      "color": "#F59E0B",
      "notificationEnabled": true,
      "notificationId": "notif-5678",
      "createdAt": "2025-01-12T10:00:00Z",
      "updatedAt": "2025-01-12T10:00:00Z"
    }
  ]
}
```

---

### 9. 시간 선택 UI

**컴포넌트**: TimeSelector

**방식 1: 네이티브 Picker (권장)**
```typescript
import DateTimePicker from '@react-native-community/datetimepicker';

<DateTimePicker
  mode="time"
  value={selectedTime}
  onChange={handleTimeChange}
/>
```

**방식 2: 커스텀 Wheel Picker**
- 시간(0-23) / 분(0-55, 5분 단위)
- 부드러운 스크롤 애니메이션

**동작**:
- 시작 시간 선택 후 → 종료 시간 자동으로 +1시간 제안
- 종료 시간이 시작 시간보다 빠르면 경고

---

### 10. 시간 중복 처리

**중복 감지**:
```typescript
function hasOverlap(newSchedule: Schedule, existingSchedules: Schedule[]): boolean {
  return existingSchedules.some(schedule => {
    const newStart = timeToMinutes(newSchedule.startTime);
    const newEnd = timeToMinutes(newSchedule.endTime);
    const existStart = timeToMinutes(schedule.startTime);
    const existEnd = timeToMinutes(schedule.endTime);
    
    return (newStart < existEnd && newEnd > existStart);
  });
}
```

**UI 표시**:
- 중첩된 일정은 겹쳐서 표시 (시계 화면)
- 경고 표시하되 저장은 허용
- 리스트 화면에서는 모두 표시

---

## 사용자 플로우

### 일정 추가 플로우

```
1. 메인 화면 진입
   ↓
2. 빈 시간대 터치 or "+ 일정 추가" 버튼
   ↓
3. 일정 모달 열림
   ↓
4. 정보 입력:
   - 제목: "팀 회의"
   - 시간: 14:00 - 15:30
   - 카테고리: 미팅 선택
   - 알림: ON
   ↓
5. "저장" 버튼 터치
   ↓
6. 저장 완료 + 알림 스케줄링
   ↓
7. 모달 닫힘
   ↓
8. 시계 화면에 주황색 아크 표시 (14:00-15:30 구간)
```

### 일정 수정 플로우

```
1. 시계 화면에서 아크 터치
   ↓
2. 일정 모달 열림 (기존 정보 표시)
   ↓
3. 시간 수정: 14:00 → 15:00
   ↓
4. "저장" 버튼
   ↓
5. 업데이트 + 알림 재스케줄링
   ↓
6. 아크 위치 변경됨
```

### 일정 삭제 플로우

```
1. 리스트 화면
   ↓
2. 일정 아이템 좌측 스와이프
   ↓
3. 빨간색 "삭제" 버튼 노출
   ↓
4. 터치 → 확인 Alert
   ↓
5. "확인" 선택
   ↓
6. 일정 삭제 + 알림 취소
   ↓
7. 아이템이 리스트에서 사라짐
```

---

## MVP 제외 기능 (향후 확장)

### Phase 2
- 드래그로 일정 시간 조정
- 반복 일정 (매일, 매주)
- 커스텀 카테고리 추가
- 다크 모드
- 위젯 지원

### Phase 3
- 클라우드 동기화 (Firebase/Supabase)
- 여러 날짜 지원 (주간/월간 뷰)
- Google/Apple 캘린더 연동
- 시간 사용 통계 및 분석
- 일정 공유 기능
- 음성 입력으로 일정 추가

---

## 에러 처리

### 사용자 입력 에러

| 에러 | 처리 |
|------|------|
| 제목 미입력 | "제목을 입력해주세요" 토스트 |
| 종료 시간 < 시작 시간 | "종료 시간은 시작 시간 이후여야 합니다" Alert |
| 시간 중복 | "이미 다른 일정이 있습니다. 계속하시겠습니까?" Alert (저장 허용) |

### 시스템 에러

| 에러 | 처리 |
|------|------|
| AsyncStorage 저장 실패 | 재시도 로직 + "저장 실패" 토스트 |
| 알림 권한 거부 | "알림을 받으려면 설정에서 권한을 허용해주세요" Alert |
| 알림 스케줄링 실패 | 일정은 저장, 알림만 실패 로그 |

---

## 성능 요구사항

- 앱 시작 시간: 1초 이내
- 일정 추가/수정 응답: 300ms 이내
- 일정 100개까지 부드러운 렌더링
- 메모리 사용량: 100MB 이하

---

## 접근성 (a11y)

- VoiceOver/TalkBack 지원
- 색상 대비율 WCAG AA 준수
- 터치 영역 최소 44x44 pt
- 아크 터치 시 햅틱 피드백
