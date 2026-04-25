# 개발 체크리스트

## Phase 1 — generate.ts

- [x] `genMul`에 `'3d'` 분기 추가: `rnd(100,999) × rnd(10,99)`
- [x] `genDiv`에 `'3d'` 분기 추가: `b=rnd(10,99)`, `q=rnd(ceil(100/b), floor(999/b))`
- [x] `genDiv('3d')` 재시도 루프 추가 (q 유효 범위가 빌 경우 방어)
- [x] Stage 7 선택 후 mul 문제가 세자리×두자리로 생성되는지 확인
- [x] Stage 7 선택 후 div 문제가 세자리÷두자리로 생성되는지 확인
- [x] Stage 6과 Stage 7의 문제 유형이 다른지 비교 확인

## Phase 2 — labels.ts

- [x] `RANGE_OPS_SUPPORT['3d']`에 `'mul'`, `'div'` 추가 (OpsDropdown/커스텀 UI 제거로 사실상 불필요)
- [x] 커스텀 모드(print)에서 3d 범위 선택 시 곱셈·나눗셈 선택 가능한지 확인 (해당 UI 없음 — skip)

## Phase 3 — stage.ts

- [x] 8단계: range `'mix'`, ops `['add', 'sub']`, 레이블 수정
- [x] 9단계: range `'triple'`, ops `['add', 'sub']`, 레이블 수정
- [x] 10단계: range `'3d'`, ops `['mul']`, 레이블 수정
- [x] 11단계: range `'3d'`, ops `['div']`, 레이블 수정
- [ ] 8단계 문제가 같은 분모 분수·소수 덧뺄셈으로 생성되는지 확인
- [ ] 9단계 문제가 이분모 분수·소수 덧뺄셈으로 생성되는지 확인
- [ ] 10단계 문제가 분수·소수 곱셈으로 생성되는지 확인
- [ ] 11단계 문제가 분수·소수 나눗셈으로 생성되는지 확인
