import { useEffect, useState } from 'react'
import PagesDropdown from './PagesDropdown'
import TimerWidget from './TimerWidget'
import SecretActions from './SecretActions'

interface Props {
  open: boolean
  pages: number
  onPagesChange: (p: number) => void

  timerDuration: number
  onTimerDurationChange: (s: number) => void
  timerRemaining: number
  timerRunning: boolean
  timerAlert: boolean
  onTimerStart: () => void

  openDrop: string | null
  onToggleDrop: (id: string) => void
  onCloseDrop: () => void

  secretVisible: boolean
  onShowAnswer: () => void
  onGrade: () => void
  onPrintAnswer: () => void
  onStopTimer: () => void
}

export default function MobilePanel({
  open, pages, onPagesChange,
  timerDuration, onTimerDurationChange,
  timerRemaining, timerRunning, timerAlert, onTimerStart,
  openDrop, onToggleDrop, onCloseDrop,
  secretVisible, onShowAnswer, onGrade, onPrintAnswer, onStopTimer,
}: Props) {
  const [clip, setClip] = useState(true)
  useEffect(() => {
    if (!open) setClip(true)
  }, [open])

  return (
    <div
      data-panel
      className={`transition-[max-height] duration-200 ease-in-out ${open ? 'max-h-[640px]' : 'max-h-0'} ${clip ? 'overflow-hidden' : 'overflow-visible'} sm:absolute sm:right-5 sm:top-full sm:w-[360px] sm:max-h-none sm:overflow-visible sm:transition-[opacity,transform] sm:duration-150 sm:origin-top-right ${open ? 'sm:opacity-100 sm:scale-100 sm:pointer-events-auto' : 'sm:opacity-0 sm:scale-95 sm:pointer-events-none'}`}
      onTransitionEnd={(e) => {
        if (e.propertyName === 'max-height' && open) setClip(false)
      }}
    >
      <div className="bg-navy border-t border-white/10 px-5 pt-4 pb-5 sm:border-0 sm:rounded-[8px] sm:shadow-[0_10px_28px_rgba(0,0,0,0.35)]">

        <Section label="페이지 수">
          <PagesDropdown
            pages={pages}
            onPagesChange={onPagesChange}
            open={openDrop === 'm-pages'}
            onToggle={() => onToggleDrop('m-pages')}
            onClose={onCloseDrop}
          />
        </Section>

        <Divider />

        <Section label="타이머">
          <TimerWidget
            duration={timerDuration}
            onDurationChange={onTimerDurationChange}
            remaining={timerRemaining}
            running={timerRunning}
            alert={timerAlert}
            onStart={onTimerStart}
            open={openDrop === 'timer'}
            onToggle={() => onToggleDrop('timer')}
            onClose={onCloseDrop}
          />
        </Section>

        {secretVisible && (
          <>
            <Divider />
            <div className="flex items-center gap-2 flex-wrap">
              <SecretActions
                onShowAnswer={onShowAnswer}
                onGrade={onGrade}
                onPrintAnswer={onPrintAnswer}
                onStopTimer={onStopTimer}
                withPrint
              />
            </div>
          </>
        )}

      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="text-[11px] font-bold text-white/40 tracking-[0.8px] uppercase mb-2">
        {label}
      </div>
      {children}
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-white/10 my-4" />
}
