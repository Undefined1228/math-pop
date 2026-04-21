import type { Op, Range } from '../components/ControlHeader'

export interface Problem {
  id: number
  a: number
  b: number
  op: Op
  answer: number
}

export const PROBLEMS_PER_PAGE = 20

const RANGE_BOUNDS: Record<Range, [number, number]> = {
  '1-9': [1, 9],
  '10-99': [10, 99],
  '1-99': [1, 99],
}

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeProblem(id: number, ops: Op[], range: Range): Problem {
  const op = ops[Math.floor(Math.random() * ops.length)]
  const [min, max] = RANGE_BOUNDS[range]

  let a: number, b: number

  if (op === 'sub') {
    a = rnd(min, max)
    b = rnd(min, a)
  } else if (op === 'div') {
    b = rnd(min, max)
    const maxQ = Math.floor(max / b)
    const q = rnd(1, Math.max(1, maxQ))
    a = b * q
  } else {
    a = rnd(min, max)
    b = rnd(min, max)
  }

  const answer =
    op === 'add' ? a + b :
    op === 'sub' ? a - b :
    op === 'mul' ? a * b :
    a / b

  return { id, a, b, op, answer }
}

export function generateProblems(pages: number, ops: Op[], range: Range): Problem[][] {
  return Array.from({ length: pages }, (_, p) =>
    Array.from({ length: PROBLEMS_PER_PAGE }, (_, i) =>
      makeProblem(p * PROBLEMS_PER_PAGE + i + 1, ops, range)
    )
  )
}
