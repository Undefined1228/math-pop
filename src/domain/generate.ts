import type { Op, Range } from './types'
import { PROBLEMS_PER_PAGE, type OpSym, type Problem } from './problem'

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

function genAdd(range: Range): Pair {
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
    const a = rnd(1, 9)
    const b = rnd(1, 9)
    return [a, b, a * b]
  }
  const a = rnd(1, 9)
  const b = rnd(10, 99)
  return [a, b, a * b]
}

function genDiv(range: Range): Pair {
  if (range === '1d') {
    const b = rnd(1, 9)
    const q = rnd(1, Math.floor(9 / b))
    return [b * q, b, q]
  }
  const b = rnd(2, 9)
  const q = rnd(Math.ceil(10 / b), Math.floor(99 / b))
  return [b * q, b, q]
}

function gen2Term(id: number, op: Op, range: Range): Problem {
  const [a, b, answer] =
    op === 'add' ? genAdd(range) :
    op === 'sub' ? genSub(range) :
    op === 'mul' ? genMul(range) :
    genDiv(range)

  const digits = Math.max(digitsOf(a), digitsOf(b), digitsOf(answer))
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

    const digits = Math.max(digitsOf(a), digitsOf(b), digitsOf(c), digitsOf(answer))
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

function makeProblem(id: number, ops: Op[], range: Range): Problem {
  if (range === 'triple') return gen3Term(id)
  const op = ops[Math.floor(Math.random() * ops.length)]
  return gen2Term(id, op, range)
}

export function generateProblems(pages: number, ops: Op[], range: Range): Problem[][] {
  return Array.from({ length: pages }, (_, p) =>
    Array.from({ length: PROBLEMS_PER_PAGE }, (_, i) =>
      makeProblem(p * PROBLEMS_PER_PAGE + i + 1, ops, range)
    )
  )
}
