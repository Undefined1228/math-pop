export type OpSym = '+' | '-' | '×' | '÷'

export interface Problem {
  id: number
  operands: number[]
  ops: OpSym[]
  answer: number
  digits: number
}

export const PROBLEMS_PER_PAGE = 20
