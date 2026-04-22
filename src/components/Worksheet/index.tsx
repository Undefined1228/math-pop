import type { Problem } from '../../domain/problem'
import type { Mode } from '../../domain/types'
import HoriCard from './HoriCard'
import VertCard from './VertCard'

interface Props {
  mode: Mode
  pages: Problem[][]
  showAnswer: boolean
  gradedResults: Record<number, boolean>
  inputs: Record<string, string>
  onInputChange: (key: string, val: string) => void
  printLabel: string
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
