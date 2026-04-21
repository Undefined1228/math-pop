import type { Problem } from '../utils/generateProblems'
import type { Mode } from './ControlHeader'

interface Props {
  mode: Mode
  pages: Problem[][]
  showAnswer: boolean
  gradedResults: Record<number, boolean>
  inputs: Record<string, string>
  onInputChange: (key: string, val: string) => void
}

const OP_SYMBOLS: Record<string, string> = {
  add: '+',
  sub: '−',
  mul: '×',
  div: '÷',
}

function digit(n: number, pos: 0 | 1) {
  const s = String(n).padStart(2, ' ')
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

function VertCard({ p, showAnswer, gradeResult, inputs, onInputChange }: CardProps) {
  const sym = OP_SYMBOLS[p.op]
  const ansStr = String(p.answer).padStart(4, ' ')
  const cell = 'flex items-center justify-center'
  const borderClass = gradeResult === undefined
    ? 'border border-stroke'
    : gradeResult ? 'border-2 border-green-400' : 'border-2 border-red-400'

  return (
    <div className="relative">
      <div className={`bg-paper rounded-[3px] overflow-hidden ${borderClass}`}>
        <div className="grid grid-cols-4" style={{ gridTemplateRows: '18px 44px 44px 44px' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`bg-[#F0EDE3] border-b border-[#DDD9CB] ${i < 3 ? 'border-r border-r-[#DDD9CB]' : ''} flex items-center justify-center transition-colors duration-100 focus-within:bg-[#E2DBc8]`}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={inputs[`${p.id}-c-${i}`] || ''}
                onChange={e => onInputChange(`${p.id}-c-${i}`, e.target.value.replace(/\D/g, '').slice(0, 1))}
                className="w-full h-full border-none outline-none bg-transparent text-center font-mono text-[10px] text-muted caret-muted"
              />
            </div>
          ))}

          <div className={`${cell} border-r border-b border-stroke`}>
            <Circle n={p.id} />
          </div>
          <div className="border-r border-b border-stroke" />
          <div className={`${cell} border-r border-b border-stroke font-mono text-[19px] font-medium`}>{digit(p.a, 0)}</div>
          <div className={`${cell} border-b border-stroke font-mono text-[19px] font-medium`}>{digit(p.a, 1)}</div>

          <div className={`${cell} border-r border-b border-stroke font-mono text-[22px] text-navy`}>{sym}</div>
          <div className="border-r border-b border-stroke" />
          <div className={`${cell} border-r border-b border-stroke font-mono text-[19px] font-medium`}>{digit(p.b, 0)}</div>
          <div className={`${cell} border-b border-stroke font-mono text-[19px] font-medium`}>{digit(p.b, 1)}</div>

          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`relative ${cell} ${i < 3 ? 'border-r border-stroke' : ''} bg-[#FDFAF3] transition-colors duration-100 focus-within:bg-amber-50`}
              style={{ borderTop: '2.5px solid #1C2B3A' }}
            >
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={inputs[`${p.id}-${i}`] || ''}
                onChange={e => onInputChange(`${p.id}-${i}`, e.target.value.replace(/\D/g, '').slice(0, 1))}
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
  const sym = OP_SYMBOLS[p.op]
  const borderClass = gradeResult === undefined
    ? 'border border-stroke'
    : gradeResult ? 'border-2 border-green-400' : 'border-2 border-red-400'

  return (
    <div className={`relative bg-paper rounded-[3px] h-[60px] px-[14px] flex items-end pb-[10px] gap-[10px] ${borderClass}`}>
      <Circle n={p.id} />
      <div className="font-mono text-[20px] font-medium whitespace-nowrap text-text-base">
        {p.a} <span className="text-navy mx-1">{sym}</span> {p.b}
      </div>
      <div className="font-mono text-[20px] text-navy ml-[2px]">=</div>
      <div
        className="relative flex-1 min-w-[40px] ml-1 flex items-end"
        style={{ borderBottom: '2.5px solid #1C2B3A' }}
      >
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={5}
          value={inputs[`${p.id}`] || ''}
          onChange={e => onInputChange(`${p.id}`, e.target.value.replace(/\D/g, '').slice(0, 5))}
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

export default function Worksheet({ mode, pages, showAnswer, gradedResults, inputs, onInputChange }: Props) {
  const isHori = mode === 'hori'
  const total = pages.length

  return (
    <main className="max-w-[880px] mx-auto my-7 mb-14 px-5 print:m-0 print:p-0 print:max-w-none">
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
  )
}
