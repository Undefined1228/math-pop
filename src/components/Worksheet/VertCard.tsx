import React, { useState } from 'react'
import { inputKey, carryKey } from '../../domain/grade'
import Circle from './Circle'
import GradeBadge from './GradeBadge'
import { NO_FILL, SYM_DISPLAY, borderClass, type CardProps } from './shared'

function digitAt(n: number, width: number, pos: number) {
  const s = String(n).padStart(width, ' ')
  return s[pos] === ' ' ? '' : s[pos]
}

export default function VertCard({ p, showAnswer, gradeResult, inputs, onInputChange }: CardProps) {
  const [focused, setFocused] = useState<string | null>(null)
  const cols = p.digits + 1
  const ansStr = String(p.answer).padStart(cols, ' ')
  const cell = 'flex items-center justify-center'

  const carryCols = Array.from({ length: cols }, (_, i) => i)
  const ansCols = Array.from({ length: cols }, (_, i) => i)

  return (
    <div className="relative">
      <div className={`bg-paper rounded-[3px] overflow-hidden ${borderClass(gradeResult)}`}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `18px ${'44px '.repeat(p.operands.length).trim()} 44px`,
          }}
        >
          {carryCols.map(i => (
            <div
              key={`carry-${i}`}
              className={`border-b border-[#DDD9CB] ${i < cols - 1 ? 'border-r border-r-[#DDD9CB]' : ''} flex items-center justify-center transition-colors duration-100 ${focused === 'c-' + i ? 'bg-[#E2DBC8]' : 'bg-[#F0EDE3]'}`}
            >
              <input
                {...NO_FILL}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={inputs[carryKey(p.id, i)] || ''}
                onChange={e => onInputChange(carryKey(p.id, i), e.target.value.replace(/\D/g, '').slice(0, 1))}
                onFocus={() => setFocused('c-' + i)}
                onBlur={() => setFocused(null)}
                className="w-full h-full border-none outline-none bg-transparent text-center font-mono text-[10px] text-muted caret-muted"
              />
            </div>
          ))}

          {p.operands.map((value, row) => {
            const isFirstRow = row === 0
            const symIdx = row - 1
            const sym = isFirstRow ? '' : SYM_DISPLAY[p.ops[symIdx]] || ''
            const operandDigits = Array.from({ length: p.digits }, (_, i) => i)
            return (
              <React.Fragment key={`row-${row}`}>
                <div className={`${cell} border-r border-b border-stroke ${isFirstRow ? '' : 'font-mono text-[22px] text-navy'}`}>
                  {isFirstRow ? <Circle n={p.id} /> : sym}
                </div>
                {operandDigits.map(i => {
                  const isLastCol = i === p.digits - 1
                  return (
                    <div
                      key={`r${row}-d${i}`}
                      className={`${cell} border-b border-stroke ${isLastCol ? '' : 'border-r'} font-mono text-[19px] font-medium`}
                    >
                      {digitAt(value, p.digits, i)}
                    </div>
                  )
                })}
              </React.Fragment>
            )
          })}

          {ansCols.map(i => (
            <div
              key={`ans-${i}`}
              className={`relative ${cell} ${i < cols - 1 ? 'border-r border-stroke' : ''} transition-colors duration-100 ${focused === 'a-' + i ? 'bg-amber-100' : 'bg-white'}`}
              style={{ borderTop: '2.5px solid #1C2B3A' }}
            >
              <input
                {...NO_FILL}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={inputs[inputKey(p.id, i)] || ''}
                onChange={e => onInputChange(inputKey(p.id, i), e.target.value.replace(/\D/g, '').slice(0, 1))}
                onFocus={() => setFocused('a-' + i)}
                onBlur={() => setFocused(null)}
                className={`w-full h-full border-none outline-none bg-transparent text-center font-mono text-[19px] font-medium text-accent caret-accent ${showAnswer ? 'opacity-20' : ''}`}
              />
              {showAnswer && ansStr[i] !== ' ' && (
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[19px] font-medium text-navy pointer-events-none">
                  {ansStr[i]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      {gradeResult !== undefined && <GradeBadge result={gradeResult} />}
    </div>
  )
}
