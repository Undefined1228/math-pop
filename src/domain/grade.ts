import type { Problem } from './problem'
import type { Mode } from './types'

export const inputKey = (pid: number, idx?: number) =>
  idx === undefined ? `${pid}` : `${pid}-${idx}`

export const carryKey = (pid: number, idx: number) => `${pid}-c-${idx}`

export function gradeProblem(
  problem: Problem,
  mode: Mode,
  inputs: Record<string, string>,
): boolean {
  if (mode === 'vert') {
    const cols = problem.digits + 1
    const digits = Array.from({ length: cols }, (_, i) => inputs[inputKey(problem.id, i)] || '').join('')
    const userAns = digits.trim() ? parseInt(digits, 10) : NaN
    return userAns === problem.answer
  }
  return parseInt(inputs[inputKey(problem.id)] || '', 10) === problem.answer
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
