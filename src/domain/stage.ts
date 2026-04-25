import type { Op, Range, Mode, Stage, FracConfig } from './types'

type StagePreset = {
  label: string
  range: Range
  ops: Op[]
  mode: Mode
  count: number
  durationSec: number
  noCarry?: boolean
  divRange?: Range
  fracConfig?: FracConfig
}

export const STAGE_PRESETS: Record<Stage, StagePreset> = {
  1:  { label: '1단계 · 초1-1 · 한 자리 덧뺄셈',           range: '1d', ops: ['add', 'sub'],        mode: 'hori', count: 160, durationSec: 1800, noCarry: true },
  2:  { label: '2단계 · 초1-2 · 받아올림·내림 덧뺄셈',      range: '1d', ops: ['add', 'sub'],        mode: 'hori', count: 130, durationSec: 1800 },
  3:  { label: '3단계 · 초2-1 · 두 자리 덧뺄셈',           range: '2d', ops: ['add', 'sub'],        mode: 'vert', count: 160, durationSec: 1800 },
  4:  { label: '4단계 · 초2-2 · 곱셈구구',                 range: '1d', ops: ['mul'],               mode: 'hori', count: 80,  durationSec: 1800 },
  5:  { label: '5단계 · 초3-1 · 세 자리 덧뺄셈·나눗셈',    range: '3d', ops: ['add', 'sub', 'div'], mode: 'vert', count: 80,  durationSec: 2400, divRange: '1d' },
  6:  { label: '6단계 · 초3-2 · 두자리×한자리·나눗셈',     range: '2d', ops: ['mul', 'div'],        mode: 'vert', count: 85,  durationSec: 2400 },
  7:  { label: '7단계 · 초4-1 · 세자리×두자리·세자리÷두자리', range: '3d', ops: ['mul', 'div'],     mode: 'vert', count: 70,  durationSec: 3000 },
  8:  { label: '8단계 · 초4-2 · 분수·소수 덧뺄셈',          range: '1d', ops: ['add', 'sub'], mode: 'hori', count: 60, durationSec: 3000, fracConfig: { sameDenom: true,  decimalPlaces: 1 } },
  9:  { label: '9단계 · 초5-1 · 이분모 분수·소수 덧뺄셈',   range: '1d', ops: ['add', 'sub'], mode: 'hori', count: 50, durationSec: 3600, fracConfig: { sameDenom: false, decimalPlaces: 2 } },
  10: { label: '10단계 · 초5-2 · 분수·소수 곱셈',           range: '1d', ops: ['mul'],        mode: 'hori', count: 40, durationSec: 3600, fracConfig: { sameDenom: false, decimalPlaces: 1 } },
  11: { label: '11단계 · 초6-1 · 분수·소수 나눗셈',         range: '1d', ops: ['div'],        mode: 'hori', count: 40, durationSec: 3600, fracConfig: { sameDenom: false, decimalPlaces: 1 } },
}

export const PASS_RATIO = 0.8

export function isPass(correct: number, total: number): boolean {
  return total > 0 && correct / total >= PASS_RATIO
}
