import React, { useState } from 'react'
import type { Problem } from '../domain/problem'
import type { Mode } from '../domain/types'
import { inputKey, carryKey } from '../domain/grade'

interface Props {
  mode: Mode
  pages: Problem[][]
  showAnswer: boolean
  gradedResults: Record<number, boolean>
  inputs: Record<string, string>
  onInputChange: (key: string, val: string) => void
  printLabel: string
}

const SYM_DISPLAY: Record<string, string> = {
  '+': '+',
  '-': '−',
  '×': '×',
  '÷': '÷',
}

function digitAt(n: number, width: number, pos: number) {
  const s = String(n).padStart(width, ' ')
  return s[pos] === ' ' ? '' : s[pos]
}

function Circle({ n }: { n: number }) {
  return (
    <span className="w-[21px] h-[21px] rounded-full border-[1.5px] border-text-base flex items-center justify-center font-sans text-[11.5px] font-bold shrink-0">
      {n}
    </span>
  )
}

function GradeBadge({ result }: { result: boolean }) {
  return (
    <span className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-sm z-10 print:hidden ${result ? 'bg-green-500' : 'bg-red-400'}`}>
      {result ? '○' : '×'}
    </span>
  )
}

interface CardProps {
  p: Problem
  showAnswer: boolean
  gradeResult: boolean | undefined
  inputs: Record<string, string>
  onInputChange: (key: string, val: string) => void
}

const NO_FILL: React.InputHTMLAttributes<HTMLInputElement> = {
  autoComplete: 'off',
  autoCorrect: 'off',
  autoCapitalize: 'none',
  spellCheck: false,
  // @ts-ignore
  'data-form-type': 'other',
  'data-lpignore': 'true',
}

function VertCard({ p, showAnswer, gradeResult, inputs, onInputChange }: CardProps) {
  const [focused, setFocused] = useState<string | null>(null)
  const cols = p.digits + 1
  const ansStr = String(p.answer).padStart(cols, ' ')
  const cell = 'flex items-center justify-center'
  const borderClass = gradeResult === undefined
    ? 'border border-stroke'
    : gradeResult ? 'border-2 border-green-400' : 'border-2 border-red-400'

  const carryCols = Array.from({ length: cols }, (_, i) => i)
  const ansCols = Array.from({ length: cols }, (_, i) => i)

  return (
    <div className="relative">
      <div className={`bg-paper rounded-[3px] overflow-hidden ${borderClass}`}>
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

function HoriCard({ p, showAnswer, gradeResult, inputs, onInputChange }: CardProps) {
  const borderClass = gradeResult === undefined
    ? 'border border-stroke'
    : gradeResult ? 'border-2 border-green-400' : 'border-2 border-red-400'

  const answerMaxLen = Math.max(5, String(p.answer).length + 1)

  return (
    <div className={`relative bg-paper rounded-[3px] h-[60px] px-[14px] flex items-end pb-[10px] gap-[10px] ${borderClass}`}>
      <Circle n={p.id} />
      <div className="font-mono text-[20px] font-medium whitespace-nowrap text-text-base">
        {p.operands.map((v, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-navy mx-1">{SYM_DISPLAY[p.ops[i - 1]]}</span>}
            {v}
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
            {p.answer}
          </span>
        )}
      </div>
      {gradeResult !== undefined && <GradeBadge result={gradeResult} />}
    </div>
  )
}

export default function Worksheet({ mode, pages, showAnswer, gradedResults, inputs, onInputChange, printLabel }: Props) {
  const isHori = mode === 'hori'
  const total = pages.length

  return (
    <form autoComplete="off" onSubmit={e => e.preventDefault()} className="contents">
    <main className="max-w-[880px] mx-auto my-7 mb-14 px-5 print:m-0 print:p-0 print:max-w-none">
      <div className="hidden print:block text-[12px] font-sans text-[#666] mb-3 tracking-[0.3px]">
        {printLabel}
      </div>
      {pages.map((problems, pi) => (
        <div key={pi} className="mb-12 print:mb-0 print:break-after-page last:print:break-after-avoid">
          <div className="flex items-center gap-3 mb-4 print:hidden">
            <span className="text-[12px] font-bold text-[#666] tracking-[0.6px] whitespace-nowrap">
              {pi + 1} / {total}
            </span>
            <div className="flex-1 h-[2px] bg-[#AEAD9E]" />
          </div>

          <div className={
            isHori
              ? 'grid grid-cols-2 gap-[18px] max-[400px]:grid-cols-1'
              : 'grid grid-cols-4 gap-[18px] max-[700px]:grid-cols-3 max-[520px]:grid-cols-2 max-[340px]:grid-cols-1'
          }>
            {problems.map(p =>
              isHori
                ? <HoriCard key={p.id} p={p} showAnswer={showAnswer} gradeResult={gradedResults[p.id]} inputs={inputs} onInputChange={onInputChange} />
                : <VertCard key={p.id} p={p} showAnswer={showAnswer} gradeResult={gradedResults[p.id]} inputs={inputs} onInputChange={onInputChange} />
            )}
          </div>
        </div>
      ))}
    </main>
    </form>
  )
}
