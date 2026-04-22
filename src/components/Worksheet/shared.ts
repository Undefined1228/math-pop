import type React from 'react'
import type { Problem } from '../../domain/problem'

export const SYM_DISPLAY: Record<string, string> = {
  '+': '+',
  '-': '−',
  '×': '×',
  '÷': '÷',
}

export const NO_FILL: React.InputHTMLAttributes<HTMLInputElement> = {
  autoComplete: 'off',
  autoCorrect: 'off',
  autoCapitalize: 'none',
  spellCheck: false,
  // @ts-ignore
  'data-form-type': 'other',
  'data-lpignore': 'true',
}

export interface CardProps {
  p: Problem
  showAnswer: boolean
  gradeResult: boolean | undefined
  inputs: Record<string, string>
  onInputChange: (key: string, val: string) => void
}

export function borderClass(gradeResult: boolean | undefined) {
  if (gradeResult === undefined) return 'border border-stroke'
  return gradeResult ? 'border-2 border-green-400' : 'border-2 border-red-400'
}
