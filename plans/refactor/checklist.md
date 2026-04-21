# 리팩토링 체크리스트

각 단계는 독립적으로 **커밋 가능**하도록 순서화되어 있다.
모든 단계 완료 후에도 UI·동작·스타일은 현재와 동일해야 한다.

## Phase 1 — 도메인 레이어 분리

- [x] `src/domain/types.ts` 생성: `Mode`, `Op`, `Range`를 `ControlHeader.tsx`에서 이동
- [x] `src/domain/labels.ts` 생성: `OP_LABELS`, `RANGE_LABELS`, `RANGE_ORDER`, `RANGE_OPS_SUPPORT`, `ALL_OPS` 이동
- [x] `src/domain/problem.ts` 생성: `Problem`, `OpSym`, `PROBLEMS_PER_PAGE` 이동 (`utils/generateProblems.ts` 분해)
- [x] `src/domain/generate.ts` 생성: `generateProblems` 본체 이동, 연산별 전략을 작은 함수로 분리
  - `genAdd(range) → [a, b, answer]`
  - `genSub(range) → [a, b, answer]`
  - `genMul(range) → [a, b, answer]`
  - `genDiv(range) → [a, b, answer]`
  - `gen3Term` 유지 (재시도 로직 그대로)
- [x] import 경로 일괄 갱신 (`App.tsx`, `Worksheet.tsx`, 그리고 새 파일들끼리)
- [x] `src/utils/generateProblems.ts` 삭제 또는 re-export 셸만 유지 후 다음 커밋에서 제거

> ✅ 검증: `npm run build` 통과, 기존 페이지 로드 및 문제 생성 동일.

## Phase 2 — 채점 로직 분리

- [x] `src/domain/grade.ts` 생성
  - `inputKey(pid, idx)`, `carryKey(pid, idx)` 같은 키 생성 함수
  - `gradeProblem(problem, mode, inputs): boolean` 순수 함수 (현재 `App.tsx` `handleGrade`에서 분기 이관)
  - `gradeAll(pages, mode, inputs): Record<number, boolean>`
- [x] `App.tsx`의 `handleGrade`는 `gradeAll` 호출만 하도록 축소
- [x] `Worksheet.tsx`·`VertCard` 내부의 키 문자열도 `inputKey` 유틸로 통일

> ✅ 검증: 가로셈/세로셈 각각 정답·오답 표시가 기존과 동일.

## Phase 3 — 훅 추출

- [ ] `src/hooks/useTimer.ts`
  - input: `durationSeconds`
  - output: `{ remaining, running, start, stop, alert }`
  - 내부에 카운트다운 interval + `alert` 트리거 시 비프음 AudioContext 로직 포함
- [ ] `src/hooks/useLongPress.ts`
  - `useLongPress(onTrigger, ms=600)` → 이벤트 핸들러 객체 반환 (mousedown/up/leave, touchstart/end/cancel)
- [ ] `src/hooks/useOutsideClick.ts`
  - 특정 셀렉터(`[data-drop]`) 바깥 클릭 시 콜백 호출
- [ ] `src/hooks/usePrintAnswers.ts`
  - `handlePrintAnswer`의 `showAnswer`/`afterprint`/`setTimeout` 타이밍을 캡슐화
  - `App.tsx`에서는 `printAnswers(setShowAnswer)` 한 줄 호출
- [ ] 각 훅 적용 후 `ControlHeader.tsx`·`App.tsx`에서 기존 useState/useEffect/useRef 제거

> ✅ 검증: 타이머 시작/종료/종료 비프음, 타이틀 롱프레스, 드롭다운 바깥 클릭, 정답지 인쇄 흐름 모두 동일.

## Phase 4 — UI 프리미티브

- [ ] `src/components/ui/Dropdown.tsx`
  - 현재 `ControlHeader.tsx`의 `MENU_CLS`, `ITEM_CLS`, `CTRL_BTN_CLS`를 흡수
  - props: `label`, `open`, `onToggle`, `items: { key, label, active }[]`, `onSelect`
  - 데스크탑·모바일 범위/페이지 드롭다운이 이걸 재사용
- [ ] 단, 2회 이상 동일 구조가 반복될 때만 추출. 연산 드롭다운은 체크박스 기반이라 별도 컴포넌트로 둘지 판단.

## Phase 5 — ControlHeader 분할

`src/components/ControlHeader/` 하위로 분할. 각 파일은 자체 props만 받고, 상위 `index.tsx`가 조립만 담당.

- [ ] `ModeToggle.tsx` — `mode`, `onModeChange`
- [ ] `RangeDropdown.tsx` — `range`, `onRangeChange`, `ops`, `onOpsChange` (range 전환 시 ops 필터 로직 포함)
- [ ] `OpsDropdown.tsx` — `range`, `ops`, `onOpsChange`
- [ ] `PagesDropdown.tsx` — `pages`, `onPagesChange`
- [ ] `TimerWidget.tsx` — `useTimer` 훅 소비, `stopTimer`를 부모에 노출 (시크릿 버튼용)
- [ ] `SecretActions.tsx` — `onShowAnswer`, `onGrade`, `onPrintAnswer`, `onStopTimer`, `withPrint?` prop
- [ ] `MobilePanel.tsx` — 햄버거 토글된 상태에서의 렌더링
- [ ] `index.tsx` — `secretVisible` 상태(롱프레스)만 보유하고 위 컴포넌트들을 배치

> ✅ 검증: 데스크탑·모바일 양쪽에서 모든 컨트롤이 기존과 동일하게 동작. 햄버거 애니메이션, 타이머 진행 바, 시크릿 버튼 토글 확인.

## Phase 6 — Worksheet 분할

- [ ] `src/components/Worksheet/GradeBadge.tsx`
- [ ] `src/components/Worksheet/VertCard.tsx`
- [ ] `src/components/Worksheet/HoriCard.tsx`
- [ ] `src/components/Worksheet/index.tsx` — 페이지/그리드 레이아웃만 담당
- [ ] 두 카드 공통 `borderClass` 로직과 `NO_FILL` props는 같은 폴더 내 `shared.ts`로 이동

## Phase 7 — 마무리

- [ ] `tree.txt` 갱신 (혹은 삭제 검토 — 실제 디렉터리 tree와 drift가 쉬움)
- [ ] `README.md` "구조" 섹션 갱신
- [ ] 미사용 import/변수 정리 (`npm run lint`)
- [ ] 최종 빌드 + 실기기 인쇄 테스트

## 범위 밖 (이번에는 건드리지 않음)

- 테스트 프레임워크 도입 (Vitest 등) — 별도 작업
- Tailwind 클래스 문자열 전반 정리 — 기능 리팩토링 후 별건으로
- 접근성(aria-*) 개선 — 별건
- 상태관리 라이브러리 도입 — 현재 규모에선 불필요
