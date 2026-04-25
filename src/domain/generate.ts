import type { Op, Range, FracConfig } from './types'
import { PROBLEMS_PER_PAGE, isFraction, type OpSym, type Problem, type Fraction } from './problem'

const OP_SYM: Record<Op, OpSym> = { add: '+', sub: '-', mul: '×', div: '÷' }

const RANGE_BOUNDS: Record<Range, [number, number]> = {
  '1d': [1, 9],
  '2d': [10, 99],
  '3d': [100, 999],
  '4d': [1000, 9999],
  'mix': [100, 9999],
  'triple': [100, 9999],
}

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function digitsOf(n: number) {
  return String(n).length
}

function rndMix() {
  return Math.random() < 0.5 ? rnd(100, 999) : rnd(1000, 9999)
}

type Pair = [a: number, b: number, answer: number]

function genAdd(range: Range, noCarry?: boolean): Pair {
  if (noCarry && range === '1d') {
    const a = rnd(1, 8)
    const b = rnd(1, 9 - a)
    return [a, b, a + b]
  }
  const [min, max] = RANGE_BOUNDS[range]
  const a = range === 'mix' ? rndMix() : rnd(min, max)
  const b = range === 'mix' ? rndMix() : rnd(min, max)
  return [a, b, a + b]
}

function genSub(range: Range): Pair {
  const [min, max] = RANGE_BOUNDS[range]
  const a = range === 'mix' ? rndMix() : rnd(min, max)
  const b = rnd(min, a)
  return [a, b, a - b]
}

function genMul(range: Range): Pair {
  if (range === '1d') {
    const a = rnd(2, 9)
    const b = rnd(2, 9)
    return [a, b, a * b]
  }
  if (range === '3d') {
    const a = rnd(100, 999)
    const b = rnd(10, 99)
    return [a, b, a * b]
  }
  const a = rnd(2, 9)
  const b = rnd(10, 99)
  return [a, b, a * b]
}

function genDiv(range: Range): Pair {
  if (range === '1d') {
    const b = rnd(2, 9)
    const q = rnd(2, 9)
    return [b * q, b, q]
  }
  if (range === '3d') {
    const MAX_TRIES = 50
    for (let t = 0; t < MAX_TRIES; t++) {
      const b = rnd(10, 99)
      const qMin = Math.ceil(100 / b)
      const qMax = Math.floor(999 / b)
      if (qMin > qMax) continue
      const q = rnd(qMin, qMax)
      return [b * q, b, q]
    }
    return [120, 10, 12]
  }
  const b = rnd(2, 9)
  const q = rnd(Math.ceil(10 / b), Math.floor(99 / b))
  return [b * q, b, q]
}

function gen2Term(id: number, op: Op, range: Range, noCarry?: boolean, divRange?: Range): Problem {
  const [a, b, answer] =
    op === 'add' ? genAdd(range, noCarry) :
    op === 'sub' ? genSub(range) :
    op === 'mul' ? genMul(range) :
    genDiv(divRange ?? range)

  const digits = Math.max(digitsOf(a), digitsOf(b))
  return {
    id,
    operands: [a, b],
    ops: [OP_SYM[op]],
    answer,
    digits,
  }
}

function gen3Term(id: number): Problem {
  const MAX_TRIES = 50
  for (let t = 0; t < MAX_TRIES; t++) {
    const a = rnd(100, 9999)
    const op1: OpSym = Math.random() < 0.5 ? '+' : '-'
    const b = rnd(100, 9999)
    const mid = op1 === '+' ? a + b : a - b
    if (mid < 0) continue
    const op2: OpSym = Math.random() < 0.5 ? '+' : '-'
    const c = rnd(100, 9999)
    const answer = op2 === '+' ? mid + c : mid - c
    if (answer < 0) continue

    const digits = Math.max(digitsOf(a), digitsOf(b), digitsOf(c))
    return {
      id,
      operands: [a, b, c],
      ops: [op1, op2],
      answer,
      digits,
    }
  }
  console.warn('gen3Term: exhausted retries, using fallback')
  const a = 500, b = 200, c = 100
  return {
    id,
    operands: [a, b, c],
    ops: ['+', '-'],
    answer: a + b - c,
    digits: 4,
  }
}

// --- 분수·소수 생성 ---

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

function simplify(f: Fraction): Fraction {
  const g = gcd(Math.abs(f.num), f.den)
  return { num: f.num / g, den: f.den / g }
}

function fracAdd(a: Fraction, b: Fraction): Fraction {
  return simplify({ num: a.num * b.den + b.num * a.den, den: a.den * b.den })
}

function fracSub(a: Fraction, b: Fraction): Fraction {
  return simplify({ num: a.num * b.den - b.num * a.den, den: a.den * b.den })
}

function fracMul(a: Fraction, b: Fraction): Fraction {
  return simplify({ num: a.num * b.num, den: a.den * b.den })
}

function fracDiv(a: Fraction, b: Fraction): Fraction {
  return simplify({ num: a.num * b.den, den: a.den * b.num })
}

function genFracProblem(id: number, op: Op, sameDenom: boolean): Problem {
  const MAX_TRIES = 50
  for (let t = 0; t < MAX_TRIES; t++) {
    let f1: Fraction, f2: Fraction, answer: Fraction

    if (op === 'add' || op === 'sub') {
      if (sameDenom) {
        const den = rnd(3, 10)
        if (op === 'add') {
          const a = rnd(1, den - 2)
          const b = rnd(1, den - 1 - a)
          f1 = { num: a, den }
          f2 = { num: b, den }
          answer = simplify({ num: a + b, den })
        } else {
          const a = rnd(2, den - 1)
          const b = rnd(1, a - 1)
          f1 = { num: a, den }
          f2 = { num: b, den }
          answer = simplify({ num: a - b, den })
        }
      } else {
        const den1 = rnd(2, 8)
        let den2 = rnd(2, 8)
        while (den2 === den1) den2 = rnd(2, 8)
        f1 = { num: rnd(1, den1 - 1), den: den1 }
        f2 = { num: rnd(1, den2 - 1), den: den2 }
        if (op === 'add') {
          answer = fracAdd(f1, f2)
          if (answer.num >= answer.den) continue
        } else {
          if (f1.num * f2.den <= f2.num * f1.den) continue
          answer = fracSub(f1, f2)
          if (answer.num <= 0) continue
        }
      }
    } else if (op === 'mul') {
      f1 = { num: rnd(1, 5), den: rnd(3, 8) }
      f2 = { num: rnd(1, 5), den: rnd(3, 8) }
      if (f1.num >= f1.den || f2.num >= f2.den) continue
      answer = fracMul(f1, f2)
    } else {
      f1 = { num: rnd(1, 5), den: rnd(3, 8) }
      f2 = { num: rnd(1, 5), den: rnd(3, 8) }
      if (f1.num >= f1.den || f2.num >= f2.den) continue
      answer = fracDiv(f1, f2)
      if (answer.num <= 0 || answer.den <= 0) continue
    }

    return { id, operands: [f1, f2], ops: [OP_SYM[op]], answer, digits: 1, kind: 'fraction' }
  }

  return {
    id,
    operands: [{ num: 1, den: 4 }, { num: 2, den: 4 }],
    ops: ['+'],
    answer: { num: 3, den: 4 },
    digits: 1,
    kind: 'fraction',
  }
}

function genDecProblem(id: number, op: Op, places: 1 | 2): Problem {
  const scale = places === 1 ? 10 : 100

  if (op === 'mul') {
    const a = rnd(1, 9)
    const b = rnd(2, 9)
    return {
      id,
      operands: [a / 10, b / 10],
      ops: [OP_SYM[op]],
      answer: Math.round(a * b) / 100,
      digits: 1,
      kind: 'decimal',
      decimalPlaces: 2,
    }
  }

  if (op === 'div') {
    for (let t = 0; t < 50; t++) {
      const q = rnd(2, 9)
      const b = rnd(1, 9)
      const a = q * b
      if (a >= 100) continue
      return {
        id,
        operands: [a / 10, b / 10],
        ops: [OP_SYM[op]],
        answer: q,
        digits: 1,
        kind: 'decimal',
        decimalPlaces: 1,
      }
    }
    return { id, operands: [0.6, 0.3], ops: ['÷'], answer: 2, digits: 1, kind: 'decimal', decimalPlaces: 1 }
  }

  if (op === 'sub') {
    const a = rnd(2, scale - 1)
    const b = rnd(1, a - 1)
    return {
      id,
      operands: [a / scale, b / scale],
      ops: [OP_SYM[op]],
      answer: (a - b) / scale,
      digits: 1,
      kind: 'decimal',
      decimalPlaces: places,
    }
  }

  const a = rnd(1, scale - 1)
  const b = rnd(1, scale - 1)
  return {
    id,
    operands: [a / scale, b / scale],
    ops: [OP_SYM[op]],
    answer: (a + b) / scale,
    digits: 1,
    kind: 'decimal',
    decimalPlaces: places,
  }
}

function genFracOrDecProblem(id: number, ops: Op[], config: FracConfig): Problem {
  const op = ops[Math.floor(Math.random() * ops.length)]
  return Math.random() < 0.5
    ? genFracProblem(id, op, config.sameDenom)
    : genDecProblem(id, op, config.decimalPlaces)
}

// --- 정수 문제 ---

function makeProblem(id: number, ops: Op[], range: Range, noCarry?: boolean, divRange?: Range, fracConfig?: FracConfig): Problem {
  if (fracConfig) return genFracOrDecProblem(id, ops, fracConfig)
  if (range === 'triple') return gen3Term(id)
  const op = ops[Math.floor(Math.random() * ops.length)]
  return gen2Term(id, op, range, noCarry, divRange)
}

export function generateProblems(
  pages: number,
  ops: Op[],
  range: Range,
  options?: { count?: number; noCarry?: boolean; divRange?: Range; fracConfig?: FracConfig },
): Problem[][] {
  const { count, noCarry, divRange, fracConfig } = options ?? {}
  if (count !== undefined) {
    const pageCount = Math.ceil(count / PROBLEMS_PER_PAGE)
    let id = 1
    return Array.from({ length: pageCount }, (_, p) => {
      const perPage = Math.min(count - p * PROBLEMS_PER_PAGE, PROBLEMS_PER_PAGE)
      return Array.from({ length: perPage }, () => makeProblem(id++, ops, range, noCarry, divRange, fracConfig))
    })
  }
  return Array.from({ length: pages }, (_, p) =>
    Array.from({ length: PROBLEMS_PER_PAGE }, (_, i) =>
      makeProblem(p * PROBLEMS_PER_PAGE + i + 1, ops, range, noCarry, divRange, fracConfig)
    )
  )
}

// isFraction re-export for external use
export { isFraction }
