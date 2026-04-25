import React from 'react'
import { inputKey } from '../../domain/grade'
import Circle from './Circle'
import GradeBadge from './GradeBadge'
import { NO_FILL, SYM_DISPLAY, borderClass, type CardProps } from './shared'

export default function HoriCard({ p, showAnswer, gradeResult, inputs, onInputChange }: CardProps) {
  const answerMaxLen = Math.max(5, String(p.answer as number).length + 1)

  return (
    <div className={`relative bg-paper rounded-[3px] h-[60px] px-[14px] flex items-end pb-[10px] gap-[10px] ${borderClass(gradeResult)}`}>
      <Circle n={p.id} />
      <div className="font-mono text-[20px] font-medium whitespace-nowrap text-text-base">
        {p.operands.map((v, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-navy mx-1">{SYM_DISPLAY[p.ops[i - 1]]}</span>}
            {v as number}
          </React.Fragment>
        ))}
      </div>
      <div className="font-mono text-[20px] text-navy ml-[2px]">=</div>
      <div
        className="relative flex-1 min-w-[40px] ml-1 flex items-end"
        style={{ borderBottom: '2.5px solid #1C2B3A' }}
      >
        <input
          {...NO_FILL}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={answerMaxLen}
          value={inputs[inputKey(p.id)] || ''}
          onChange={e => onInputChange(inputKey(p.id), e.target.value.replace(/\D/g, '').slice(0, answerMaxLen))}
          className={`w-full border-none outline-none bg-transparent text-center font-mono text-[19px] font-medium text-accent caret-accent pb-[2px] ${showAnswer ? 'opacity-20' : ''}`}
        />
        {showAnswer && (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[19px] font-medium text-navy pointer-events-none pb-[2px]">
            {p.answer as number}
          </span>
        )}
      </div>
      {gradeResult !== undefined && <GradeBadge result={gradeResult} />}
    </div>
  )
}
