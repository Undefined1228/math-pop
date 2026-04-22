import { useState, useEffect } from 'react'
import ControlHeader from './components/ControlHeader'
import Worksheet from './components/Worksheet'
import type { Mode, Op, Range } from './domain/types'
import { OP_LABELS, RANGE_LABELS } from './domain/labels'
import type { Problem } from './domain/problem'
import { generateProblems } from './domain/generate'
import { gradeAll } from './domain/grade'
import { usePrintAnswers } from './hooks/usePrintAnswers'

export default function App() {
  const [mode, setMode] = useState<Mode>('vert')
  const [ops, setOps] = useState<Op[]>(['add'])
  const [range, setRange] = useState<Range>('2d')
  const [pages, setPages] = useState(1)
  const [problems, setProblems] = useState<Problem[][]>([])
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [showAnswer, setShowAnswer] = useState(false)
  const [gradedResults, setGradedResults] = useState<Record<number, boolean>>({})

  useEffect(() => {
    setProblems(generateProblems(1, ['add'], '2d'))
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

  const handlePrintAnswer = usePrintAnswers(showAnswer, setShowAnswer)

  const handleGrade = () => {
    if (Object.keys(gradedResults).length > 0) {
      setGradedResults({})
      return
    }
    setGradedResults(gradeAll(problems.slice(0, pages), mode, inputs))
  }

  const visibleProblems = problems.slice(0, pages)
  const gradedCount = Object.keys(gradedResults).length
  const correctCount = Object.values(gradedResults).filter(Boolean).length
  const printLabel = [RANGE_LABELS[range], ...ops.map(o => OP_LABELS[o])].join(' · ')

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
          printLabel={printLabel}
        />
      )}
    </>
  )
}
