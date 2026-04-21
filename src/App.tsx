import { useState, useEffect } from 'react'
import ControlHeader, { type Mode, type Op, type Range } from './components/ControlHeader'
import Worksheet from './components/Worksheet'
import { generateProblems, type Problem } from './utils/generateProblems'

export default function App() {
  const [mode, setMode] = useState<Mode>('vert')
  const [ops, setOps] = useState<Op[]>(['add'])
  const [range, setRange] = useState<Range>('10-99')
  const [pages, setPages] = useState(1)
  const [problems, setProblems] = useState<Problem[][]>([])
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [showAnswer, setShowAnswer] = useState(false)
  const [gradedResults, setGradedResults] = useState<Record<number, boolean>>({})

  useEffect(() => {
    setProblems(generateProblems(1, ['add'], '10-99'))
  }, [])

  const resetState = () => {
    setInputs({})
    setShowAnswer(false)
    setGradedResults({})
  }

  const generate = () => {
    setProblems(generateProblems(pages, ops, range))
    resetState()
  }

  const handleModeChange = (m: Mode) => {
    setMode(m)
    resetState()
  }

  const handlePagesChange = (p: number) => {
    setPages(p)
    if (p > problems.length) {
      setProblems(generateProblems(p, ops, range))
      resetState()
    }
  }

  const handleInputChange = (key: string, val: string) => {
    setInputs(prev => ({ ...prev, [key]: val }))
  }

  const handleShowAnswer = () => setShowAnswer(p => !p)

  const handlePrintAnswer = () => {
    if (showAnswer) {
      window.print()
      return
    }
    setShowAnswer(true)
    const afterPrint = () => {
      setShowAnswer(false)
      window.removeEventListener('afterprint', afterPrint)
    }
    window.addEventListener('afterprint', afterPrint)
    setTimeout(() => window.print(), 50)
  }

  const handleGrade = () => {
    if (Object.keys(gradedResults).length > 0) {
      setGradedResults({})
      return
    }
    const results: Record<number, boolean> = {}
    for (const page of problems.slice(0, pages)) {
      for (const p of page) {
        if (mode === 'vert') {
          const digits = [0, 1, 2, 3].map(i => inputs[`${p.id}-${i}`] || '').join('')
          const userAns = digits.trim() ? parseInt(digits, 10) : NaN
          results[p.id] = userAns === p.answer
        } else {
          results[p.id] = parseInt(inputs[`${p.id}`] || '', 10) === p.answer
        }
      }
    }
    setGradedResults(results)
  }

  const visibleProblems = problems.slice(0, pages)
  const gradedCount = Object.keys(gradedResults).length
  const correctCount = Object.values(gradedResults).filter(Boolean).length

  return (
    <>
      <ControlHeader
        mode={mode}
        ops={ops}
        range={range}
        pages={pages}
        onModeChange={handleModeChange}
        onOpsChange={setOps}
        onRangeChange={setRange}
        onPagesChange={handlePagesChange}
        onGenerate={generate}
        onShowAnswer={handleShowAnswer}
        onGrade={handleGrade}
        onPrintAnswer={handlePrintAnswer}
      />
      {gradedCount > 0 && (
        <div className="max-w-[880px] mx-auto px-5 pt-5 print:hidden">
          <div className="bg-paper border border-stroke rounded-[6px] px-4 py-2.5 text-[13.5px] font-sans inline-block">
            <span className="font-bold text-text-base">
              {gradedCount}문제 중 <span className="text-accent">{correctCount}개</span> 정답
            </span>
          </div>
        </div>
      )}
      {visibleProblems.length > 0 && (
        <Worksheet
          mode={mode}
          pages={visibleProblems}
          showAnswer={showAnswer}
          gradedResults={gradedResults}
          inputs={inputs}
          onInputChange={handleInputChange}
        />
      )}
    </>
  )
}
