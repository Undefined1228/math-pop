import { useEffect, useState } from 'react'
import { useLongPress } from '../../hooks/useLongPress'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import type { AppMode, Stage } from '../../domain/types'
import AppModeToggle from './AppModeToggle'
import StageDropdown from './StageDropdown'
import SecretActions from './SecretActions'
import MobilePanel from './MobilePanel'
import TimerAlertOverlay from './TimerAlertOverlay'

interface Props {
  appMode: AppMode
  onAppModeChange: (m: AppMode) => void
  stage: Stage
  onStageChange: (s: Stage) => void
  onTestStart: () => void
  testRunning: boolean
  pages: number
  onPagesChange: (p: number) => void
  onShowAnswer: () => void
  onGrade: () => void
  onPrintAnswer: () => void
  timerDuration: number
  onTimerDurationChange: (s: number) => void
  timerRemaining: number
  timerRunning: boolean
  timerAlert: boolean
  onTimerStart: () => void
  onTimerStop: () => void
  recommendedTimerSec: number
  stageDropFocusReq?: boolean
  onStageDropFocusHandled?: () => void
}

export default function ControlHeader({
  appMode, onAppModeChange,
  stage, onStageChange,
  onTestStart, testRunning,
  pages, onPagesChange,
  onShowAnswer, onGrade, onPrintAnswer,
  timerDuration, onTimerDurationChange,
  timerRemaining, timerRunning, timerAlert, onTimerStart, onTimerStop,
  recommendedTimerSec,
  stageDropFocusReq, onStageDropFocusHandled,
}: Props) {
  const [openDrop, setOpenDrop] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [secretVisible, setSecretVisible] = useState(false)

  useEffect(() => {
    if (!stageDropFocusReq) return
    setMobileOpen(true)
    setOpenDrop('m-stage')
    onStageDropFocusHandled?.()
  }, [stageDropFocusReq])

  const titleHandlers = useLongPress(() => setSecretVisible(v => !v))
  useOutsideClick('[data-drop]', () => setOpenDrop(null))
  useOutsideClick('[data-panel], [data-hamburger]', () => setMobileOpen(false))

  const toggleDrop = (id: string) => setOpenDrop(p => p === id ? null : id)
  const closeDrop = () => setOpenDrop(null)

  return (
    <header className="sticky top-0 z-[100] bg-navy shadow-[0_3px_14px_rgba(0,0,0,0.3)] print:hidden">
      <div className="h-[58px] px-5 flex items-center gap-3">

        <div
          className="font-heading text-[17px] font-bold text-white tracking-[-0.3px] whitespace-nowrap mr-1 shrink-0 select-none cursor-default"
          {...titleHandlers}
        >
          MathPop
        </div>

        <div className="max-sm:hidden shrink-0" data-drop>
          <StageDropdown
            stage={stage}
            onStageChange={onStageChange}
            open={openDrop === 'd-stage'}
            onToggle={() => toggleDrop('d-stage')}
            onClose={closeDrop}
            label={`${stage}단계`}
          />
        </div>

        <div className="ml-auto flex items-center gap-2 shrink-0">
          <AppModeToggle appMode={appMode} onAppModeChange={onAppModeChange} />

          {appMode === 'test' && (
            <button
              className="h-[34px] px-4 rounded-[6px] border-0 bg-accent text-white text-[13px] font-bold cursor-pointer font-sans transition-[background,opacity] duration-[130ms] hover:bg-accent-h disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              onClick={onTestStart}
              disabled={testRunning}
            >
              테스트 시작
            </button>
          )}

          <button
            className="h-[34px] px-[14px] rounded-[6px] border border-white/25 bg-transparent text-white text-[13px] cursor-pointer flex items-center gap-[6px] font-sans transition-[background] duration-[130ms] hover:bg-white/10 max-sm:hidden"
            onClick={() => window.print()}
          >
            🖨 인쇄
          </button>

          {appMode === 'print' && secretVisible && (
            <div className="max-sm:hidden">
              <SecretActions
                onShowAnswer={onShowAnswer}
                onGrade={onGrade}
                onPrintAnswer={onPrintAnswer}
                onStopTimer={onTimerStop}
              />
            </div>
          )}

          <button
            data-hamburger
            className="w-[36px] h-[36px] rounded-[6px] border border-white/20 bg-white/[0.08] cursor-pointer flex flex-col items-center justify-center gap-[5px] transition-[background] duration-[130ms] hover:bg-white/[0.16] shrink-0"
            onClick={() => setMobileOpen(p => !p)}
          >
            <span className={`block w-4 h-[1.5px] bg-white rounded-[2px] transition-all duration-200 ${mobileOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`block w-4 h-[1.5px] bg-white rounded-[2px] transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-4 h-[1.5px] bg-white rounded-[2px] transition-all duration-200 ${mobileOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {timerRemaining < timerDuration && (
        <div className="h-[5px] w-full bg-white/[0.08] print:hidden">
          <div
            className="h-full transition-[width,background-color] duration-1000 ease-linear"
            style={{
              width: `${(timerRemaining / timerDuration) * 100}%`,
              backgroundColor: `hsl(${(timerRemaining / timerDuration) * 120}, 72%, 50%)`,
            }}
          />
        </div>
      )}

      <MobilePanel
        open={mobileOpen}
        appMode={appMode}
        stage={stage}
        onStageChange={onStageChange}
        onTestStart={onTestStart}
        testRunning={testRunning}
        pages={pages}
        onPagesChange={onPagesChange}
        timerDuration={timerDuration}
        onTimerDurationChange={onTimerDurationChange}
        timerRemaining={timerRemaining}
        timerRunning={timerRunning}
        timerAlert={timerAlert}
        onTimerStart={onTimerStart}
        recommendedTimerSec={recommendedTimerSec}
        openDrop={openDrop}
        onToggleDrop={toggleDrop}
        onCloseDrop={closeDrop}
        secretVisible={secretVisible}
        onShowAnswer={onShowAnswer}
        onGrade={onGrade}
        onPrintAnswer={onPrintAnswer}
        onStopTimer={onTimerStop}
      />

      <TimerAlertOverlay remaining={timerRemaining} duration={timerDuration} running={timerRunning} />
    </header>
  )
}
