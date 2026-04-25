export type OpSym = '+' | '-' | '×' | '÷'

export type Fraction = { num: number; den: number }
export type Operand = number | Fraction

export function isFraction(v: Operand): v is Fraction {
  return typeof v === 'object' && v !== null
}

export interface Problem {
  id: number
  operands: Operand[]
  ops: OpSym[]
  answer: Operand
  digits: number
  kind?: 'fraction' | 'decimal'
  decimalPlaces?: number
}

export const PROBLEMS_PER_PAGE = 20
