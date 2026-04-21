import type { Op, Range } from './types'

export const OP_LABELS: Record<Op, string> = {
  add: '덧셈',
  sub: '뺄셈',
  mul: '곱셈',
  div: '나눗셈',
}

export const RANGE_LABELS: Record<Range, string> = {
  '1d': '한 자리 (1 ~ 9)',
  '2d': '두 자리 (10 ~ 99)',
  '3d': '세 자리 (100 ~ 999)',
  '4d': '네 자리 (1000 ~ 9999)',
  'mix': '세·네 자리 혼합',
  'triple': '세 수의 연산 (100 ~ 9999)',
}

export const RANGE_ORDER: Range[] = ['1d', '2d', '3d', '4d', 'mix', 'triple']

export const ALL_OPS: Op[] = ['add', 'sub', 'mul', 'div']

export const RANGE_OPS_SUPPORT: Record<Range, Op[]> = {
  '1d': ['add', 'sub', 'mul', 'div'],
  '2d': ['add', 'sub', 'mul', 'div'],
  '3d': ['add', 'sub'],
  '4d': ['add', 'sub'],
  'mix': ['add', 'sub'],
  'triple': ['add', 'sub'],
}
