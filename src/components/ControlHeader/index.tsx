import { useState } from 'react'
import type { Mode, Op, Range } from '../../domain/types'
import { useTimer } from '../../hooks/useTimer'
import { useLongPress } from '../../hooks/useLongPress'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import SecretActions from './SecretActions'
import MobilePanel from './MobilePanel'

interface Props {
  mode: Mode
  ops: Op[]
  range: Range
  pages: number
  onModeChange: (m: Mode) => void
  onOpsChange: (ops: Op[]) => void
  onRangeChange: (r: Range) => void
  onPagesChange: (p: number) => void
  onGenerate: () => void
  onShowAnswer: () => void
  onGrade: () => void
  onPrintAnswer: () => void
}

export default function ControlHeader({
  mode, ops, range, pages,
  onModeChange, onOpsChange, onRangeChange, onPagesChange,
  onGenerate, onShowAnswer, onGrade, onPrintAnswer,
}: Props) {
  const [openDrop, setOpenDrop] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [timerDuration, setTimerDuration] = useState(300)
  const [secretVisible, setSecretVisible] = useState(false)

  const { remaining, running, start: startTimer, stop: stopTimer, alert: timerAlert } = useTimer(timerDuration)
  const titleHandlers = useLongPress(() => setSecretVisible(v => !v))
  useOutsideClick('[data-drop]', () => setOpenDrop(null))

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

        {/* 우측 액션 */}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <button
            className="h-[34px] px-4 rounded-[6px] border-0 bg-accent text-white text-[13px] font-bold cursor-pointer font-sans transition-[background] duration-[130ms] hover:bg-accent-h"
            onClick={onGenerate}
          >
            새로 생성
          </button>
          <button
            className="h-[34px] px-[14px] rounded-[6px] border border-white/25 bg-transparent text-white text-[13px] cursor-pointer flex items-center gap-[6px] font-sans transition-[background] duration-[130ms] hover:bg-white/10 max-sm:hidden"
            onClick={() => window.print()}
          >
            🖨 인쇄
          </button>

          {secretVisible && (
            <div className="max-sm:hidden">
              <SecretActions
                onShowAnswer={onShowAnswer}
                onGrade={onGrade}
                onPrintAnswer={onPrintAnswer}
                onStopTimer={stopTimer}
              />
            </div>
          )}

          {/* 햄버거 버튼 */}
          <button
            className="w-[36px] h-[36px] rounded-[6px] border border-white/20 bg-white/[0.08] cursor-pointer flex flex-col items-center justify-center gap-[5px] transition-[background] duration-[130ms] hover:bg-white/[0.16] shrink-0"
            onClick={() => setMobileOpen(p => !p)}
          >
            <span className={`block w-4 h-[1.5px] bg-white rounded-[2px] transition-all duration-200 ${mobileOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`block w-4 h-[1.5px] bg-white rounded-[2px] transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-4 h-[1.5px] bg-white rounded-[2px] transition-all duration-200 ${mobileOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* 타이머 진행 바 */}
      {remaining < timerDuration && (
        <div className="h-[5px] w-full bg-white/[0.08] print:hidden">
          <div
            className="h-full transition-[width,background-color] duration-1000 ease-linear"
            style={{
              width: `${(remaining / timerDuration) * 100}%`,
              backgroundColor: `hsl(${(remaining / timerDuration) * 120}, 72%, 50%)`,
            }}
          />
        </div>
      )}

      <MobilePanel
        open={mobileOpen}
        mode={mode}
        ops={ops}
        range={range}
        pages={pages}
        onModeChange={onModeChange}
        onOpsChange={onOpsChange}
        onRangeChange={onRangeChange}
        onPagesChange={onPagesChange}
        timerDuration={timerDuration}
        onTimerDurationChange={setTimerDuration}
        timerRemaining={remaining}
        timerRunning={running}
        timerAlert={timerAlert}
        onTimerStart={startTimer}
        openDrop={openDrop}
        onToggleDrop={toggleDrop}
        onCloseDrop={closeDrop}
        secretVisible={secretVisible}
        onShowAnswer={onShowAnswer}
        onGrade={onGrade}
        onPrintAnswer={onPrintAnswer}
        onStopTimer={stopTimer}
      />
    </header>
  )
}
