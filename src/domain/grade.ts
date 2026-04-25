import { type Problem, type Fraction } from './problem'
import type { Mode } from './types'

export const inputKey = (pid: number, idx?: number) =>
  idx === undefined ? `${pid}` : `${pid}-${idx}`

export const carryKey = (pid: number, idx: number) => `${pid}-c-${idx}`

export const fracNumKey = (pid: number) => `${pid}-fnum`
export const fracDenKey = (pid: number) => `${pid}-fden`

export function gradeProblem(
  problem: Problem,
  mode: Mode,
  inputs: Record<string, string>,
): boolean {
  if (problem.kind === 'fraction') {
    const num = parseInt(inputs[fracNumKey(problem.id)] || '', 10)
    const den = parseInt(inputs[fracDenKey(problem.id)] || '', 10)
    if (isNaN(num) || isNaN(den) || den === 0 || num <= 0) return false
    const ans = problem.answer as Fraction
    return num * ans.den === den * ans.num
  }

  if (problem.kind === 'decimal') {
    const str = inputs[inputKey(problem.id)] || ''
    const userVal = parseFloat(str)
    if (isNaN(userVal)) return false
    const ans = problem.answer as number
    return Math.round(userVal * 10000) === Math.round(ans * 10000)
  }

  if (mode === 'vert') {
    const cols = problem.digits + 1
    const digits = Array.from({ length: cols }, (_, i) => inputs[inputKey(problem.id, i)] || '').join('')
    const userAns = digits.trim() ? parseInt(digits, 10) : NaN
    return userAns === (problem.answer as number)
  }
  return parseInt(inputs[inputKey(problem.id)] || '', 10) === (problem.answer as number)
}

export function gradeAll(
  pages: Problem[][],
  mode: Mode,
  inputs: Record<string, string>,
): Record<number, boolean> {
  const results: Record<number, boolean> = {}
  for (const page of pages) {
    for (const p of page) {
      results[p.id] = gradeProblem(p, mode, inputs)
    }
  }
  return results
}
