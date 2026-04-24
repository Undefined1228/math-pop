export type Mode = 'vert' | 'hori'
export type Op = 'add' | 'sub' | 'mul' | 'div'
export type Range = '1d' | '2d' | '3d' | '4d' | 'mix' | 'triple'
export type AppMode = 'print' | 'test'
export type Stage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export type TestResult = {
  stage: Stage
  correct: number
  total: number
  elapsedSec: number
  passed: boolean
  wrongIndices: number[]
}
