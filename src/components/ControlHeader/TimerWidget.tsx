import Dropdown from '../ui/Dropdown'

const TIMER_OPTIONS = [30, ...Array.from({ length: 8 }, (_, i) => (i + 3) * 60)]
const fmtOption = (s: number) => s < 60 ? `${s}초` : `${s / 60}분`
const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

interface Props {
  duration: number
  onDurationChange: (s: number) => void
  remaining: number
  running: boolean
  alert: boolean
  onStart: () => void
  open: boolean
  onToggle: () => void
  onClose: () => void
}

export default function TimerWidget({
  duration, onDurationChange, remaining, running, alert, onStart,
  open, onToggle, onClose,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <Dropdown
        label={fmtOption(duration)}
        open={open}
        onToggle={onToggle}
        items={TIMER_OPTIONS.map(s => ({ key: s, label: fmtOption(s), active: duration === s }))}
        onSelect={(key) => { onDurationChange(key as number); onClose() }}
        disabled={running}
      />
      <button
        className="h-[34px] px-[15px] rounded-[6px] border-0 bg-accent text-white text-[13px] font-sans transition-[background,opacity] duration-[130ms] hover:bg-accent-h disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={onStart}
        disabled={running}
      >
        시작
      </button>
      <span
        className={`font-mono text-[19px] font-medium tracking-[2px] min-w-[56px] text-center transition-colors ${
          alert
            ? 'text-red-400'
            : remaining <= 10 && running
              ? 'text-orange-300'
              : 'text-white'
        }`}
        style={alert ? { animation: 'timer-blink 0.6s ease-in-out infinite' } : undefined}
      >
        {fmt(remaining)}
      </span>
    </div>
  )
}
