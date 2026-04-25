import React from 'react'
import { inputKey, fracNumKey, fracDenKey } from '../../domain/grade'
import { isFraction, type Fraction, type Operand } from '../../domain/problem'
import Circle from './Circle'
import GradeBadge from './GradeBadge'
import { NO_FILL, SYM_DISPLAY, borderClass, type CardProps } from './shared'

function FracDisplay({ f }: { f: Fraction }) {
  return (
    <div className="inline-flex flex-col items-center leading-none gap-[3px]">
      <span className="font-mono text-[17px] font-medium">{f.num}</span>
      <div className="self-stretch border-t-[1.5px] border-text-base" />
      <span className="font-mono text-[17px] font-medium">{f.den}</span>
    </div>
  )
}

function FracInput({ pid, inputs, onInputChange, showAnswer, answer }: {
  pid: number
  inputs: Record<string, string>
  onInputChange: (key: string, val: string) => void
  showAnswer: boolean
  answer: Fraction
}) {
  return (
    <div className="relative inline-flex flex-col items-center leading-none gap-[1px]">
      <input
        {...NO_FILL}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={3}
        value={inputs[fracNumKey(pid)] || ''}
        onChange={e => onInputChange(fracNumKey(pid), e.target.value.replace(/\D/g, '').slice(0, 3))}
        className={`w-[44px] h-[26px] border-none outline-none bg-transparent text-center font-mono text-[17px] font-medium text-accent caret-accent ${showAnswer ? 'opacity-20' : ''}`}
      />
      <div className="self-stretch border-t-[2px] border-navy" />
      <input
        {...NO_FILL}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={3}
        value={inputs[fracDenKey(pid)] || ''}
        onChange={e => onInputChange(fracDenKey(pid), e.target.value.replace(/\D/g, '').slice(0, 3))}
        className={`w-[44px] h-[26px] border-none outline-none bg-transparent text-center font-mono text-[17px] font-medium text-accent caret-accent ${showAnswer ? 'opacity-20' : ''}`}
      />
      {showAnswer && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-[3px]">
          <span className="font-mono text-[17px] font-medium text-navy">{answer.num}</span>
          <div className="self-stretch border-t-[1.5px] border-navy" />
          <span className="font-mono text-[17px] font-medium text-navy">{answer.den}</span>
        </div>
      )}
    </div>
  )
}

function OperandDisplay({ v }: { v: Operand }) {
  if (isFraction(v)) return <FracDisplay f={v} />
  return <span className="font-mono text-[18px] font-medium">{v}</span>
}

export default function FracCard({ p, showAnswer, gradeResult, inputs, onInputChange }: CardProps) {
  const isFrac = p.kind === 'fraction'
  const ansMaxLen = 8

  return (
    <div className={`relative bg-paper rounded-[3px] px-[14px] flex items-center gap-[8px] h-[80px] ${borderClass(gradeResult)}`}>
      <Circle n={p.id} />

      <div className="flex items-center gap-[8px]">
        {p.operands.map((v, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <span className="font-mono text-[20px] text-navy">{SYM_DISPLAY[p.ops[i - 1]]}</span>
            )}
            <OperandDisplay v={v} />
          </React.Fragment>
        ))}
      </div>

      <span className="font-mono text-[20px] text-navy">=</span>

      <div className="flex-1 min-w-[44px] flex items-center justify-center">
        {isFrac ? (
          <FracInput
            pid={p.id}
            inputs={inputs}
            onInputChange={onInputChange}
            showAnswer={showAnswer}
            answer={p.answer as Fraction}
          />
        ) : (
          <div
            className="relative w-full flex items-center"
            style={{ borderBottom: '2.5px solid #1C2B3A' }}
          >
            <input
              {...NO_FILL}
              type="text"
              inputMode="decimal"
              maxLength={ansMaxLen}
              value={inputs[inputKey(p.id)] || ''}
              onChange={e => onInputChange(inputKey(p.id), e.target.value.replace(/[^0-9.]/g, '').slice(0, ansMaxLen))}
              className={`w-full border-none outline-none bg-transparent text-center font-mono text-[18px] font-medium text-accent caret-accent pb-[2px] ${showAnswer ? 'opacity-20' : ''}`}
            />
            {showAnswer && (
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[18px] font-medium text-navy pointer-events-none pb-[2px]">
                {String(p.answer as number)}
              </span>
            )}
          </div>
        )}
      </div>

      {gradeResult !== undefined && <GradeBadge result={gradeResult} />}
    </div>
  )
}
