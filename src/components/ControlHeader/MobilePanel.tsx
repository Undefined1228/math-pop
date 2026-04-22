import type { Mode, Op, Range } from '../../domain/types'
import { OP_LABELS, ALL_OPS, RANGE_LABELS, RANGE_OPS_SUPPORT } from '../../domain/labels'
import ModeToggle from './ModeToggle'
import RangeDropdown from './RangeDropdown'
import PagesDropdown from './PagesDropdown'
import TimerWidget from './TimerWidget'
import SecretActions from './SecretActions'

interface Props {
  open: boolean
  mode: Mode
  ops: Op[]
  range: Range
  pages: number
  onModeChange: (m: Mode) => void
  onOpsChange: (ops: Op[]) => void
  onRangeChange: (r: Range) => void
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
  open, mode, ops, range, pages,
  onModeChange, onOpsChange, onRangeChange, onPagesChange,
  timerDuration, onTimerDurationChange,
  timerRemaining, timerRunning, timerAlert, onTimerStart,
  openDrop, onToggleDrop, onCloseDrop,
  secretVisible, onShowAnswer, onGrade, onPrintAnswer, onStopTimer,
}: Props) {
  const supportedOps = RANGE_OPS_SUPPORT[range]
  const isOpEnabled = (op: Op) => supportedOps.includes(op)
  const opTooltip = (op: Op): string | undefined =>
    isOpEnabled(op) ? undefined : `${RANGE_LABELS[range]}에서는 ${OP_LABELS[op]} 미지원`
  const toggleOp = (op: Op) => {
    if (!isOpEnabled(op)) return
    if (ops.includes(op) && ops.length === 1) return
    onOpsChange(ops.includes(op) ? ops.filter(o => o !== op) : [...ops, op])
  }

  return (
    <div className={`sm:hidden overflow-hidden transition-[max-height] duration-200 ease-in-out ${open ? 'max-h-[640px]' : 'max-h-0'}`}>
      <div className="bg-navy border-t border-white/10 px-5 pt-4 pb-5">

        <Section label="셈 방식">
          <ModeToggle mode={mode} onModeChange={onModeChange} />
        </Section>

        <Divider />

        <Section label="숫자 범위">
          <RangeDropdown
            range={range}
            ops={ops}
            onRangeChange={onRangeChange}
            onOpsChange={onOpsChange}
            open={openDrop === 'm-range'}
            onToggle={() => onToggleDrop('m-range')}
            onClose={onCloseDrop}
          />
        </Section>

        <Divider />

        <Section label="연산 종류">
          <div className="flex gap-2 flex-wrap">
            {ALL_OPS.map(op => {
              const enabled = isOpEnabled(op)
              return (
                <label
                  key={op}
                  title={opTooltip(op)}
                  className={`flex items-center gap-[6px] bg-white/[0.08] border border-white/15 rounded-[6px] px-3 py-[6px] text-white text-[13px] font-sans transition-opacity duration-150 ${enabled ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
                >
                  <input
                    type="checkbox"
                    checked={ops.includes(op)}
                    onChange={() => toggleOp(op)}
                    disabled={!enabled}
                    className="accent-accent w-[14px] h-[14px] disabled:cursor-not-allowed"
                  />
                  {OP_LABELS[op]}
                </label>
              )
            })}
          </div>
        </Section>

        <Divider />

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
