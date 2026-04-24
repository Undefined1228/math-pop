# Stage 7+ 문제 생성 버그 수정 계획

## 배경

7단계 이후 문제가 의도와 다르게 생성되는 버그. 원인은 두 가지:

1. `genMul` / `genDiv`가 `'1d'` 범위만 분기하고 나머지를 동일하게 처리 → Stage 7이 Stage 6과 동일한 문제 생성
2. Stage 8~11이 분수·소수 레이블이지만 구현이 없어 1자리 정수 연산 생성

---

## Phase 1: generate.ts — genMul/genDiv '3d' 분기 추가

**파일**: `src/domain/generate.ts`

### genMul 수정

| range | 현재 | 수정 후 |
|---|---|---|
| `'1d'` | rnd(1,9) × rnd(1,9) | 동일 (유지) |
| `'2d'` | rnd(1,9) × rnd(10,99) | 동일 (유지) |
| `'3d'` | rnd(1,9) × rnd(10,99) ← **버그** | rnd(100,999) × rnd(10,99) |

### genDiv 수정

| range | 현재 | 수정 후 |
|---|---|---|
| `'1d'` | (b×q)÷b, b=rnd(1,9) | 동일 (유지) |
| `'2d'` | (b×q)÷b, b=rnd(2,9), 결과=두자리 | 동일 (유지) |
| `'3d'` | (b×q)÷b, b=rnd(2,9), 결과=두자리 ← **버그** | b=rnd(10,99), q=rnd(ceil(100/b), floor(999/b)) |

`genDiv('3d')` 구현 시 `q`의 유효 범위가 비는 경우를 막기 위해 재시도 루프 추가.

---

## Phase 2: labels.ts — RANGE_OPS_SUPPORT 보완

**파일**: `src/domain/labels.ts`

`RANGE_OPS_SUPPORT['3d']`에 `'mul'`, `'div'` 추가.

```
현재: '3d': ['add', 'sub']
수정: '3d': ['add', 'sub', 'mul', 'div']
```

Phase 1 완료 후 진행.

---

## Phase 3: stage.ts — Stage 8~11 재매핑

**파일**: `src/domain/stage.ts`

분수·소수 실제 구현은 Problem 타입·grade 로직·Worksheet UI 전체를 건드리는 대형 작업이므로,
현재 구현 범위 내에서 의미 있는 정수 연산으로 재매핑한다.

| 단계 | 현재 레이블 | 수정 후 | range | ops |
|---|---|---|---|---|
| 8 | 초4-2 · 분수·소수 덧뺄셈 | 초4-2 · 큰 수 덧뺄셈 | `'mix'` | `['add', 'sub']` |
| 9 | 초5-1 · 이분모 분수·혼합계산 | 초5-1 · 세 수 혼합계산 | `'triple'` | `['add', 'sub']` |
| 10 | 초5-2 · 분수·소수 곱셈 | 초5-2 · 큰 수 곱셈 | `'3d'` | `['mul']` |
| 11 | 초6-1 · 분수·소수 나눗셈 | 초6-1 · 큰 수 나눗셈 | `'3d'` | `['div']` |

> Phase 1 완료 후 진행 (10·11단계의 '3d' mul/div가 올바르게 동작하려면 Phase 1 선행 필요).

---

## 실행 순서

1. Phase 1 — `generate.ts` genMul/genDiv '3d' 분기 추가
2. Phase 2 — `labels.ts` RANGE_OPS_SUPPORT 보완
3. Phase 3 — `stage.ts` Stage 8~11 레이블·range·ops 재매핑

---

## 장기 과제 (별도 작업)

분수·소수 실제 구현 시 아래 전체 수정 필요:

- `types.ts` — Range에 'frac', 'dec' 타입 추가
- `problem.ts` — Problem 인터페이스에 분수 피연산자 표현 추가 (유니온 타입 분리 권장)
- `generate.ts` — 분수/소수 생성 로직
- `grade.ts` — 분수 문자열 파싱, 부동소수점 오차 처리
- `HoriCard.tsx` / `VertCard.tsx` — 분수선 UI, 분자·분모 별도 입력칸
