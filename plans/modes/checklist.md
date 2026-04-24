# 인쇄 모드 / 테스트 모드 구현 체크리스트

## Phase 1 — Domain

### `src/domain/types.ts`
- [x] `AppMode = 'print' | 'test'` 추가
- [x] `Stage = 1 | 2 | ... | 11` 추가
- [x] `TestResult = { stage: Stage, correct: number, total: number, elapsedSec: number, passed: boolean, wrongIndices: number[] }` 추가

### `src/domain/stage.ts` (신규)
- [x] `STAGE_PRESETS` 정의 (Stage 1~11, 각 `{ label, range, ops, mode, count, durationSec }`)
- [x] `PASS_RATIO = 0.8` 상수
- [x] `isPass(correct, total): boolean` 함수

### `src/domain/generate.ts`
- [x] `count` 파라미터 추가 — 절대 문항수 기준으로 생성 (테스트 모드용)
- [x] `no-carry` 플래그 추가 — 받아올림·내림 없는 덧뺄셈 생성 (단계 1용)

---

## Phase 2 — App.tsx 상태 개편

- [x] `appMode`, `stage`, `testRunning`, `testResult` 상태 추가
- [x] `mode`, `ops`, `range` 직접 상태 제거 → `stage` 프리셋에서 파생
- [x] `stage` 변경 시 프리셋으로 `(mode, ops, range)` 적용하는 핸들러 작성
- [x] 테스트 시작: `generate(count)` + `startTimer(durationSec)`
- [x] 타이머 종료 이벤트: `gradeAll()` → `testResult` 세팅
- [x] `틀린 문제만 다시 풀기`: `wrongIndices` 기반 문제 추출 → `durationSec × (틀린 수 / 전체 수)` 비례 타이머로 재시작

---

## Phase 3 — 컴포넌트 제거

- [x] `RangeDropdown` 삭제
- [x] `OpsDropdown` 삭제
- [x] `ModeToggle` (셈 방식 토글) 삭제
- [x] `MobilePanel`에서 "숫자 범위", "연산 종류", "셈 방식" 섹션 제거

---

## Phase 4 — 신규 컴포넌트

- [x] `AppModeToggle` — 인쇄/테스트 전환 토글 (기존 "새로 생성" 버튼 자리)
- [x] `StageDropdown` — 단계 1~11 선택, `label` 전체 설명 표시 (`1단계 · 초1-1 · 한 자리 덧뺄셈`)
- [x] `TestResultModal` — 단계명, 합격 여부, 정답 수, 정답률, 소요 시간 표시. 버튼: `다시 시도` / `틀린 문제만 다시 풀기` / `단계 변경` / `인쇄 모드로`

---

## Phase 5 — ControlHeader / MobilePanel 개편

- [x] "새로 생성" 버튼 → `AppModeToggle`로 교체
- [x] `StageDropdown` 추가 (양쪽 모드 공통)
- [x] `PagesDropdown` — 인쇄 모드에서만 노출
- [x] `TimerWidget` — 인쇄 모드에서만 노출. 권장 시간(`stage.durationSec × 실제 문항 수 / stage.count`) 기본값 세팅, "권장: N분" 표시
- [x] 채점 인디케이터 — 인쇄 모드에서만 노출
- [x] 테스트 모드 전용 "테스트 시작" 버튼 추가
- [x] 인쇄 버튼 — 양쪽 모드 공통 노출 (테스트 모드도 문제지·답안 인쇄 가능)

---

## Phase 6 — 테스트 모드 검증

- [x] 단계 선택 → `{ range, ops, mode, count, durationSec }` 자동 세팅 확인
- [x] "테스트 시작" → 문제 생성 + 타이머 자동 시작
- [x] 타이머 종료 → 자동 채점 + 결과 모달 표시
- [x] 결과 모달: "다시 시도" → 같은 단계 재시작
- [x] 결과 모달: "틀린 문제만 다시 풀기" → 비례 타이머로 재시작
- [x] 결과 모달: "단계 변경" → 모달 닫고 단계 드롭다운 포커스
- [x] 결과 모달: "인쇄 모드로" → appMode 전환
- [x] 테스트 모드에서 문제지·답안 인쇄 동작 확인

---

## Phase 7 — 인쇄 모드 검증

- [ ] 단계 선택 → `{ range, ops, mode }` 자동 세팅 확인
- [ ] 페이지 수 변경 → 문제 재생성
- [ ] 타이머 권장 시간 기본값 및 "권장: N분" 표시 확인
- [ ] 채점 인디케이터 정상 동작 확인
