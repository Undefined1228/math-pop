import { useEffect, useState } from 'react'
import ControlHeader from './components/ControlHeader'
import Worksheet from './components/Worksheet'
import TestResultModal from './components/TestResultModal'
import type { AppMode, Stage, TestResult } from './domain/types'
import { OP_LABELS, RANGE_LABELS } from './domain/labels'
import type { Problem } from './domain/problem'
import { PROBLEMS_PER_PAGE } from './domain/problem'
import { generateProblems } from './domain/generate'
import { gradeAll } from './domain/grade'
import { STAGE_PRESETS, isPass } from './domain/stage'
import { usePrintAnswers } from './hooks/usePrintAnswers'
import { useTimer } from './hooks/useTimer'

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('print')
  const [stage, setStage] = useState<Stage>(1)
  const [testRunning, setTestRunning] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [stageDropFocusReq, setStageDropFocusReq] = useState(false)

  const preset = STAGE_PRESETS[stage]
  const mode = preset.mode
  const ops = preset.ops
  const range = preset.range

  const [pages, setPages] = useState(1)
  const [timerDuration, setTimerDuration] = useState(
    Math.round(preset.durationSec * PROBLEMS_PER_PAGE / preset.count / 60) * 60
  )
  const [problems, setProblems] = useState<Problem[][]>(() =>
    generateProblems(1, preset.ops, preset.range, { noCarry: preset.noCarry, divRange: preset.divRange, fracConfig: preset.fracConfig })
  )
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [showAnswer, setShowAnswer] = useState(false)
  const [gradedResults, setGradedResults] = useState<Record<number, boolean>>({})

  const { remaining, running: timerRunning, start: startTimer, stop: stopTimer, alert: timerAlert } = useTimer(timerDuration)

  const recommendedTimerSec = Math.round(preset.durationSec * pages * PROBLEMS_PER_PAGE / preset.count / 60) * 60

  const resetState = () => {
    setInputs({})
    setShowAnswer(false)
    setGradedResults({})
  }

  useEffect(() => {
    if (!timerAlert || appMode !== 'test' || !testRunning) return
    const flatProblems = problems.flat()
    const results = gradeAll(problems, mode, inputs)
    const wrongIndices = flatProblems
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => !results[p.id])
      .map(({ i }) => i)
    const correct = Object.values(results).filter(Boolean).length
    const total = flatProblems.length
    setGradedResults(results)
    setTestResult({
      stage,
      correct,
      total,
      elapsedSec: preset.durationSec,
      passed: isPass(correct, total),
      wrongIndices,
    })
    setTestRunning(false)
  }, [timerAlert])

  const handleAppModeChange = (m: AppMode) => {
    setAppMode(m)
    if (m === 'print') {
      setTestRunning(false)
      stopTimer()
    }
  }

  const handleStageChange = (s: Stage) => {
    const p = STAGE_PRESETS[s]
    setStage(s)
    setProblems(generateProblems(pages, p.ops, p.range, { noCarry: p.noCarry, divRange: p.divRange, fracConfig: p.fracConfig }))
    resetState()
    setTestRunning(false)
    setTestResult(null)
    setTimerDuration(Math.round(p.durationSec * pages * PROBLEMS_PER_PAGE / p.count / 60) * 60)
  }

  const handleTestStart = () => {
    const p = STAGE_PRESETS[stage]
    const newProblems = generateProblems(1, p.ops, p.range, { count: p.count, noCarry: p.noCarry, divRange: p.divRange, fracConfig: p.fracConfig })
    setProblems(newProblems)
    resetState()
    setTestResult(null)
    setTestRunning(true)
    setTimerDuration(p.durationSec)
    startTimer(p.durationSec)
  }

  const handleRetryWrong = () => {
    if (!testResult) return
    const p = STAGE_PRESETS[stage]
    const flatProblems = problems.flat()
    const wrongProblems = testResult.wrongIndices.map(i => flatProblems[i])
    const wrongPages: Problem[][] = []
    for (let i = 0; i < wrongProblems.length; i += PROBLEMS_PER_PAGE) {
      wrongPages.push(wrongProblems.slice(i, i + PROBLEMS_PER_PAGE))
    }
    const newDuration = Math.round(p.durationSec * wrongProblems.length / p.count)
    setProblems(wrongPages)
    resetState()
    setTestResult(null)
    setTestRunning(true)
    setTimerDuration(newDuration)
    startTimer(newDuration)
  }

  const handlePagesChange = (p: number) => {
    setPages(p)
    if (p > problems.length) {
      setProblems(generateProblems(p, ops, range, { noCarry: preset.noCarry, divRange: preset.divRange, fracConfig: preset.fracConfig }))
      resetState()
    }
    setTimerDuration(Math.round(preset.durationSec * p * PROBLEMS_PER_PAGE / preset.count / 60) * 60)
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

  const visibleProblems = appMode === 'test' ? problems : problems.slice(0, pages)
  const gradedCount = Object.keys(gradedResults).length
  const correctCount = Object.values(gradedResults).filter(Boolean).length
  const printLabel = [RANGE_LABELS[range], ...ops.map(o => OP_LABELS[o])].join(' · ')

  return (
    <>
      <ControlHeader
        appMode={appMode}
        onAppModeChange={handleAppModeChange}
        stage={stage}
        onStageChange={handleStageChange}
        onTestStart={handleTestStart}
        testRunning={testRunning}
        pages={pages}
        onPagesChange={handlePagesChange}
        onShowAnswer={handleShowAnswer}
        onGrade={handleGrade}
        onPrintAnswer={handlePrintAnswer}
        timerDuration={timerDuration}
        onTimerDurationChange={setTimerDuration}
        timerRemaining={remaining}
        timerRunning={timerRunning}
        timerAlert={timerAlert}
        onTimerStart={() => startTimer()}
        onTimerStop={stopTimer}
        recommendedTimerSec={recommendedTimerSec}
        stageDropFocusReq={stageDropFocusReq}
        onStageDropFocusHandled={() => setStageDropFocusReq(false)}
      />
      {appMode === 'print' && gradedCount > 0 && (
        <div className="max-w-[880px] mx-auto px-5 pt-5 print:hidden">
          <div className="bg-paper border border-stroke rounded-[6px] px-4 py-2.5 text-[13.5px] font-sans inline-block">
            <span className="font-bold text-text-base">
              {gradedCount}문제 중 <span className="text-accent">{correctCount}개</span> 정답
              {' '}
              <span className="text-muted font-normal">
                (정답률: {Math.round((correctCount / gradedCount) * 100)}%, 점수환산: {Math.round((correctCount / gradedCount) * 100)}점/100점)
              </span>
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
      {testResult && (
        <TestResultModal
          result={testResult}
          onRetry={handleTestStart}
          onRetryWrong={handleRetryWrong}
          onChangeStage={() => { setTestResult(null); setStageDropFocusReq(true) }}
          onSwitchToPrint={() => { handleAppModeChange('print'); setTestResult(null) }}
        />
      )}
    </>
  )
}
