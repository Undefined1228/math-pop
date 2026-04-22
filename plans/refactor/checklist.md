# 리팩토링 후속 작업

Phase 1~7 리팩토링은 모두 완료되었다 (`refactor/structure` 브랜치, 커밋 이력 참고).
여기부터는 기존 계획에서 "범위 밖"으로 미뤄뒀던 작업을 실행 가능한 단위로 정리한다.
각 섹션은 독립적으로 진행·커밋할 수 있다.

## 1. 테스트 프레임워크 도입 (Vitest)

도메인 로직과 훅이 분리되었으므로 테스트 추가 비용이 낮아졌다.

- [ ] 의존성 설치: `vitest`, `@testing-library/react`, `@testing-library/user-event`, `jsdom`
- [ ] `vite.config.ts`에 `test.environment = 'jsdom'` 추가, `package.json`에 `"test": "vitest"` 스크립트 등록
- [ ] `src/domain/generate.test.ts`
  - 각 연산(`add/sub/mul/div`)이 범위별(`1d/2d/3d/4d/mix`) 제약을 만족하는지
  - `sub`는 결과가 0 이상, `div`는 나머지 없음
  - `gen3Term` 재시도 후에도 제약을 만족하는지 (시드 고정 또는 반복 실행)
- [ ] `src/domain/grade.test.ts`
  - `inputKey` / `carryKey` 키 포맷 고정
  - `gradeProblem` 가로셈/세로셈 정답·오답·빈칸 케이스
  - `gradeAll`이 page 단위 결과를 올바르게 합치는지
- [ ] `src/hooks/useTimer.test.tsx`
  - `vi.useFakeTimers()`로 카운트다운 검증
  - `durationSeconds` 변경 시 상태 리셋
  - 0 도달 시 `alert` true + `running` false
- [ ] (선택) GitHub Actions에 `npm run lint && npm run test && npm run build` 추가

## 2. Tailwind 클래스 문자열 정리

리팩토링으로 컴포넌트 경계는 명확해졌지만, 긴 클래스 문자열은 그대로다.

- [ ] `src/styles/tokens.ts`(또는 `index.css` `@theme`)로 반복 색상 하드코드 제거
  - `#DDD9CB`, `#F0EDE3`, `#E2DBC8`, `#AEAD9E`, `#666`, `#1C2B3A` 등을 CSS 변수/테마 토큰으로
- [ ] `VertCard` / `HoriCard`의 셀 스타일 유틸 클래스화
  - `cell-border`, `cell-carry`, `cell-answer` 같은 유틸을 `@layer components`에 정의
- [ ] `ControlHeader`의 버튼/드롭다운 클래스 조각(`CTRL_BTN_CLS`, `MENU_CLS`, `ITEM_CLS`)이 `ui/Dropdown.tsx`에 캡슐화되었는지 재확인, 중복 남았으면 제거
- [ ] `clsx` 또는 `tailwind-merge` 도입 검토 (조건부 클래스가 3개 이상 엉킨 JSX만)
- [ ] `print:` prefix 사용 일관성 점검 (숨김 처리가 필요한 UI에 누락 없는지)

## 3. 접근성(a11y) 개선

현재 드롭다운·햄버거·시크릿 버튼은 키보드·스크린리더 사용자에게 불친화적이다.

- [ ] `ui/Dropdown.tsx`
  - 트리거 버튼에 `aria-haspopup="menu"`, `aria-expanded`
  - 메뉴 컨테이너에 `role="menu"`, 항목에 `role="menuitem"` 혹은 체크박스 타입일 땐 `role="menuitemcheckbox"` + `aria-checked`
  - ESC 키로 닫기, ArrowUp/Down으로 항목 이동
- [ ] `OpsDropdown` / `MobilePanel`의 연산 체크박스 리스트에 `aria-checked`, 키보드 토글
- [ ] `TimerWidget`
  - 남은 시간 표시에 `aria-live="polite"`, `aria-atomic="true"`
  - 시작/정지 버튼에 현재 상태가 읽히는 `aria-label`
- [ ] 모바일 햄버거 토글 버튼: `aria-label="메뉴"`, `aria-expanded`, `aria-controls`
- [ ] 시크릿 버튼 묶음(`SecretActions`)에 적절한 landmark 또는 `aria-label`
- [ ] `Worksheet` 입력: 각 칸에 `aria-label`(예: "1번 문제 일의 자리") 부여, 채점 결과 뱃지에 `aria-label="정답" | "오답"`
- [ ] `eslint-plugin-jsx-a11y` 도입 후 경고 해소

## 4. 기타 정비

- [ ] `plans/refactor/README.md`는 역사적 기록으로 남기되, 이 파일(`checklist.md`)과의 link만 유지
- [ ] `tree.txt`를 계속 관리할지, 빌드 아티팩트 취급해 `.gitignore`로 돌릴지 결정
- [ ] 상태관리 라이브러리(Zustand/Jotai 등): **도입하지 않음**. 현재 규모에서 React 기본 훅만으로 충분하며, prop drilling 이 발생한 지점이 생겼을 때만 재검토.
