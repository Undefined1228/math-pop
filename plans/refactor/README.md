# 리팩토링 계획

현재 코드는 기능적으로 동작하나, `ControlHeader.tsx`가 538줄에 다수 관심사가 혼재되어 있어 유지보수성이 떨어진다.
아래는 **동작 변경 없이** 내부 구조를 정돈하기 위한 계획이다.

## 목표

1. **한 파일 한 책임**: 538줄짜리 `ControlHeader.tsx`를 관심사 단위로 쪼갠다.
2. **도메인과 UI 분리**: 타입·라벨·문제 생성 로직 같은 도메인 지식이 UI 컴포넌트 파일에서 import되지 않도록 한다.
3. **재사용 가능한 훅 추출**: 타이머, 롱프레스, 드롭다운 외부 클릭처럼 UI 프리미티브에 가까운 로직을 커스텀 훅으로 뽑는다.
4. **동작·스타일 불변**: 사용자가 보는 UI와 인터랙션은 그대로 유지한다. (커밋마다 브라우저로 검증)

## 현재 코드의 주요 문제

### 1. `ControlHeader.tsx`가 너무 많은 일을 한다
- 타이머 상태 + interval 관리 + 비프음 AudioContext
- 드롭다운 열림 상태 (외부 클릭 감지 포함)
- 롱프레스로 시크릿 버튼 토글
- 모바일 햄버거 메뉴 + 데스크탑/모바일 **중복 UI** (범위·연산·페이지 드롭다운이 두 벌씩 존재)
- 버튼 스타일 문자열 상수들
- `handleRangeChange`에서 `RANGE_OPS_SUPPORT`에 기반한 ops 보정 로직 (도메인 규칙)

### 2. 타입·상수가 UI 컴포넌트에서 export된다
`Mode`, `Op`, `Range`, `OP_LABELS`, `RANGE_LABELS`를 `App.tsx`·`Worksheet.tsx`·`generateProblems.ts`가 모두 `./components/ControlHeader`에서 import한다.
→ UI 컴포넌트가 실질적인 **도메인 모듈** 역할을 겸하는 구조.

### 3. 채점·입력 상태 로직이 `App.tsx`에 인라인
`handleGrade`의 세로셈 입력 파싱은 순수 함수로 뽑을 수 있음. 테스트 가능성 ↑.
`inputs: Record<string, string>`이 `${p.id}-c-${i}`, `${p.id}-${i}`, `${p.id}` 같은 문자열 키로 혼재 — 키 생성 규칙이 컴포넌트 전반에 흩어져 있다.

### 4. `Worksheet.tsx`의 `VertCard`·`HoriCard` 공통 부분 중복
- `borderClass` 계산 (미채점/정답/오답)
- `NO_FILL` props 스프레드
- `GradeBadge` 렌더 조건

### 5. `generateProblems.ts` 분기 복잡성
`gen2Term`에 `add/sub/mul/div × 1d/2d/3d/4d/mix` 분기가 중첩되어 있어 read-only로 이해하기 어렵다.
연산별 생성 전략을 작은 함수로 분리하면 각 규칙을 독립적으로 테스트·수정할 수 있다.

### 6. `handlePrintAnswer`의 타이밍 의존
`setTimeout(window.print, 50)` + `afterprint` 리스너 — 커스텀 훅으로 캡슐화해 App에서 지우자.

## 제안 폴더 구조

```
src/
├── domain/
│   ├── types.ts              # Mode, Op, Range
│   ├── labels.ts             # OP_LABELS, RANGE_LABELS, RANGE_ORDER, RANGE_OPS_SUPPORT
│   ├── problem.ts            # Problem 타입, PROBLEMS_PER_PAGE
│   ├── generate.ts           # generateProblems + 연산별 전략 함수
│   └── grade.ts              # 입력 → 답 판정 순수 함수
├── hooks/
│   ├── useTimer.ts           # 카운트다운 + 종료 비프
│   ├── useLongPress.ts       # 타이틀 롱프레스
│   ├── useOutsideClick.ts    # 드롭다운 바깥 클릭
│   └── usePrintAnswers.ts    # 정답지 인쇄 토글 타이밍
├── components/
│   ├── Worksheet/
│   │   ├── index.tsx         # 페이지 레이아웃 + 출력 라벨
│   │   ├── VertCard.tsx
│   │   ├── HoriCard.tsx
│   │   └── GradeBadge.tsx
│   ├── ControlHeader/
│   │   ├── index.tsx         # 조립만 담당
│   │   ├── ModeToggle.tsx
│   │   ├── RangeDropdown.tsx
│   │   ├── OpsDropdown.tsx
│   │   ├── PagesDropdown.tsx
│   │   ├── TimerWidget.tsx
│   │   ├── SecretActions.tsx
│   │   └── MobilePanel.tsx
│   └── ui/
│       └── Dropdown.tsx      # 공통 드롭다운 프리미티브 + MENU_CLS/ITEM_CLS
├── App.tsx
└── main.tsx
```

## 원칙

- **한 번에 한 덩어리**씩 이동하고 커밋. 타입 이동 → 훅 추출 → 컴포넌트 분할 순서.
- 각 단계마다 `npm run build`와 수동 브라우저 확인(세로/가로, 범위 전환, 타이머, 채점, 인쇄).
- 도메인 로직(`grade`, `generate`)은 분리 직후 간단한 케이스라도 테스트를 얹을 수 있으면 얹는다 (선택).
- 새 추상화를 만들기 전 먼저 **옮기기만** 한다. 동작 보존이 최우선.
- 공통 Tailwind 문자열은 섣불리 컴포넌트화하지 말고, 2회 이상 중복될 때만 추출.

상세한 실행 단계는 [`checklist.md`](./checklist.md) 참고.
