import { useState, useEffect, useRef } from 'react'

export type Mode = 'vert' | 'hori'
export type Op = 'add' | 'sub' | 'mul' | 'div'
export type Range = '1-9' | '10-99' | '1-99'

const OP_LABELS: Record<Op, string> = { add: '덧셈', sub: '뺄셈', mul: '곱셈', div: '나눗셈' }
const RANGE_LABELS: Record<Range, string> = { '1-9': '1 ~ 9', '10-99': '10 ~ 99', '1-99': '1 ~ 99' }
const ALL_OPS: Op[] = ['add', 'sub', 'mul', 'div']
const TIMER_OPTIONS = Array.from({ length: 8 }, (_, i) => (i + 3) * 60)
const fmtOption = (s: number) => s < 60 ? `${s}초` : `${s / 60}분`
const PAGE_COUNTS = Array.from({ length: 10 }, (_, i) => i + 1)

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

const VR = () => (
  <div className="w-px h-[26px] bg-white/[0.18] shrink-0" />
)

const MENU_CLS =
  'absolute top-[calc(100%+7px)] left-0 bg-white border border-stroke rounded-[8px] py-[6px] min-w-[136px] shadow-[0_10px_28px_rgba(0,0,0,0.18)] z-[300]'

const ITEM_CLS =
  'flex items-center gap-[9px] px-[14px] py-2 text-[13.5px] text-text-base cursor-pointer hover:bg-cream'

const CTRL_BTN_CLS =
  'h-[34px] px-3 rounded-[6px] border border-white/[0.18] bg-white/[0.08] text-white text-[13px] cursor-pointer flex items-center gap-[5px] whitespace-nowrap transition-[background] duration-[130ms] select-none hover:bg-white/[0.16] font-sans'

export default function ControlHeader({
  mode, ops, range, pages,
  onModeChange, onOpsChange, onRangeChange, onPagesChange,
  onGenerate, onShowAnswer, onGrade, onPrintAnswer,
}: Props) {
  const [openDrop, setOpenDrop] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [timerDuration, setTimerDuration] = useState(300)
  const [remaining, setRemaining] = useState(300)
  const [running, setRunning] = useState(false)
  const [timerAlert, setTimerAlert] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) { setRunning(false); setTimerAlert(true); return 0 }
          return r - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  useEffect(() => {
    if (!timerAlert) return
    try {
      const ctx = new AudioContext()
      const beepDuration = 0.22
      const beepGap = 0.28
      const setGap = 0.5
      const setDuration = beepDuration + beepGap * 2
      Array.from({ length: 3 }).forEach((_, set) => {
        Array.from({ length: 3 }).forEach((_, beat) => {
          const t = set * (setDuration + setGap) + beat * beepGap
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.frequency.value = 880
          osc.type = 'sine'
          gain.gain.setValueAtTime(0.4, ctx.currentTime + t)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + beepDuration)
          osc.start(ctx.currentTime + t)
          osc.stop(ctx.currentTime + t + beepDuration)
        })
      })
    } catch {}
  }, [timerAlert])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as Element).closest('[data-drop]')) setOpenDrop(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleDrop = (id: string) => setOpenDrop(p => p === id ? null : id)

  const toggleOp = (op: Op) => {
    if (ops.includes(op) && ops.length === 1) return
    onOpsChange(ops.includes(op) ? ops.filter(o => o !== op) : [...ops, op])
  }

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTimerAlert(false)
    setRemaining(timerDuration)
    setRunning(true)
  }

  const stopTimer = () => {
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const selectTimerDuration = (s: number) => {
    stopTimer()
    setTimerDuration(s)
    setRemaining(s)
    setTimerAlert(false)
    setOpenDrop(null)
  }

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const ModeToggle = () => (
    <div className="flex bg-white/[0.08] border border-white/[0.18] rounded-[6px] overflow-hidden shrink-0">
      {(['vert', 'hori'] as Mode[]).map((m, i) => (
        <button
          key={m}
          onClick={() => onModeChange(m)}
          className={`h-[34px] px-[14px] border-0 text-[13px] cursor-pointer transition-all duration-150 whitespace-nowrap font-sans ${
            mode === m
              ? 'bg-accent text-white font-bold'
              : 'bg-transparent text-white/55 hover:text-white/85'
          }`}
        >
          {i === 0 ? '세로셈' : '가로셈'}
        </button>
      ))}
    </div>
  )

  const TimerWidget = () => (
    <div className="flex items-center gap-2">
      <div className="relative" data-drop>
        <button className={CTRL_BTN_CLS} onClick={() => toggleDrop('timer')}>
          {fmtOption(timerDuration)} <span className="text-[9px] opacity-60">▾</span>
        </button>
        {openDrop === 'timer' && (
          <div className={MENU_CLS}>
            {TIMER_OPTIONS.map(s => (
              <div
                key={s}
                className={`${ITEM_CLS} ${timerDuration === s ? 'text-accent font-bold' : ''}`}
                onClick={() => selectTimerDuration(s)}
              >
                {fmtOption(s)}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        className="h-[34px] px-[15px] rounded-[6px] border-0 bg-accent text-white text-[13px] cursor-pointer font-sans transition-[background] duration-[130ms] hover:bg-accent-h"
        onClick={startTimer}
      >
        시작
      </button>
      <span
        className={`font-mono text-[19px] font-medium tracking-[2px] min-w-[56px] text-center transition-colors ${
          timerAlert
            ? 'text-red-400'
            : remaining <= 10 && running
              ? 'text-orange-300'
              : 'text-white'
        }`}
        style={timerAlert ? { animation: 'timer-blink 0.6s ease-in-out infinite' } : undefined}
      >
        {fmt(remaining)}
      </span>
    </div>
  )

  const SecretBtns = ({ withPrint = false }) => (
    <div className="flex items-center gap-[3px]">
      {withPrint && (
        <button
          className="h-[34px] px-[14px] rounded-[6px] border border-white/25 bg-transparent text-white text-[13px] cursor-pointer flex items-center gap-[6px] font-sans transition-[background] duration-[130ms] hover:bg-white/10"
          onClick={() => window.print()}
        >
          🖨 인쇄
        </button>
      )}
      {([
        { title: '정답보기', icon: '👁', fn: onShowAnswer },
        { title: '채점', icon: '✓', fn: onGrade },
        { title: '타이머 정지', icon: '⏸', fn: stopTimer },
      ] as const).map(({ title, icon, fn }) => (
        <button
          key={title}
          title={title}
          onClick={fn}
          className="w-[26px] h-[26px] rounded-[4px] border border-white/10 bg-transparent text-white/20 text-[11px] cursor-pointer flex items-center justify-center transition-all duration-150 hover:text-white/55 hover:border-white/28"
        >
          {icon}
        </button>
      ))}
    </div>
  )

  return (
    <header className="sticky top-0 z-[100] bg-navy shadow-[0_3px_14px_rgba(0,0,0,0.3)] print:hidden">
      <div className="h-[58px] px-5 flex items-center gap-3">

        <div className="font-heading text-[17px] font-bold text-white tracking-[-0.3px] whitespace-nowrap mr-1 shrink-0">
          MathPop
        </div>

        <VR />

        {/* 데스크탑 컨트롤 */}
        <div className="flex items-center gap-3 flex-1 max-sm:hidden">
          <ModeToggle />
          <VR />

          {/* 연산 드롭다운 */}
          <div className="relative" data-drop>
            <button className={CTRL_BTN_CLS} onClick={() => toggleDrop('ops')}>
              연산{' '}
              <span className="bg-accent text-white text-[11px] font-bold px-[5px] py-[1px] rounded-[10px] leading-[1.4]">
                {ops.length}
              </span>
              <span className="text-[9px] opacity-60">▾</span>
            </button>
            {openDrop === 'ops' && (
              <div className={MENU_CLS}>
                {ALL_OPS.map(op => (
                  <label
                    key={op}
                    className={`${ITEM_CLS} ${ops.includes(op) ? 'text-accent font-bold' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={ops.includes(op)}
                      onChange={() => toggleOp(op)}
                      className="accent-accent w-[14px] h-[14px]"
                    />
                    {OP_LABELS[op]}
                  </label>
                ))}
              </div>
            )}
          </div>

          <VR />

          {/* 범위 드롭다운 */}
          <div className="relative" data-drop>
            <button className={CTRL_BTN_CLS} onClick={() => toggleDrop('range')}>
              범위: {RANGE_LABELS[range]} <span className="text-[9px] opacity-60">▾</span>
            </button>
            {openDrop === 'range' && (
              <div className={MENU_CLS}>
                {(['1-9', '10-99', '1-99'] as Range[]).map(r => (
                  <div
                    key={r}
                    className={`${ITEM_CLS} ${range === r ? 'text-accent font-bold' : ''}`}
                    onClick={() => { onRangeChange(r); setOpenDrop(null) }}
                  >
                    {RANGE_LABELS[r]}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 페이지 드롭다운 */}
          <div className="relative" data-drop>
            <button className={CTRL_BTN_CLS} onClick={() => toggleDrop('pages')}>
              {pages}페이지 <span className="text-[9px] opacity-60">▾</span>
            </button>
            {openDrop === 'pages' && (
              <div className={MENU_CLS}>
                {PAGE_COUNTS.map(p => (
                  <div
                    key={p}
                    className={`${ITEM_CLS} ${pages === p ? 'text-accent font-bold' : ''}`}
                    onClick={() => { onPagesChange(p); setOpenDrop(null) }}
                  >
                    {p}페이지
                  </div>
                ))}
              </div>
            )}
          </div>

          <VR />
          <TimerWidget />
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

          {/* 숨겨진 버튼 */}
          <div className="flex gap-[3px] max-sm:hidden">
            {([
              { title: '정답보기', icon: '👁', fn: onShowAnswer },
              { title: '채점', icon: '✓', fn: onGrade },
              { title: '정답지 인쇄', icon: '🖨', fn: onPrintAnswer },
              { title: '타이머 정지', icon: '⏸', fn: stopTimer },
            ] as const).map(({ title, icon, fn }) => (
              <button
                key={title}
                title={title}
                onClick={fn}
                className="w-[26px] h-[26px] rounded-[4px] border border-white/10 bg-transparent text-white/20 text-[11px] cursor-pointer flex items-center justify-center transition-all duration-150 hover:text-white/55 hover:border-white/28"
              >
                {icon}
              </button>
            ))}
          </div>

          {/* 햄버거 버튼 */}
          <button
            className="sm:hidden w-[36px] h-[36px] rounded-[6px] border border-white/20 bg-white/[0.08] cursor-pointer flex flex-col items-center justify-center gap-[5px] transition-[background] duration-[130ms] hover:bg-white/[0.16] shrink-0"
            onClick={() => setMobileOpen(p => !p)}
          >
            <span className={`block w-4 h-[1.5px] bg-white rounded-[2px] transition-all duration-200 ${mobileOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`block w-4 h-[1.5px] bg-white rounded-[2px] transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-4 h-[1.5px] bg-white rounded-[2px] transition-all duration-200 ${mobileOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* 모바일 패널 */}
      <div className={`sm:hidden overflow-hidden transition-[max-height] duration-200 ease-in-out ${mobileOpen ? 'max-h-[640px]' : 'max-h-0'}`}>
        <div className="bg-navy border-t border-white/10 px-5 pt-4 pb-5">

          <MobileSection label="셈 방식">
            <ModeToggle />
          </MobileSection>

          <div className="h-px bg-white/10 my-4" />

          <MobileSection label="연산 종류">
            <div className="flex gap-2 flex-wrap">
              {ALL_OPS.map(op => (
                <label
                  key={op}
                  className="flex items-center gap-[6px] bg-white/[0.08] border border-white/15 rounded-[6px] px-3 py-[6px] text-white text-[13px] cursor-pointer font-sans"
                >
                  <input
                    type="checkbox"
                    checked={ops.includes(op)}
                    onChange={() => toggleOp(op)}
                    className="accent-accent w-[14px] h-[14px]"
                  />
                  {OP_LABELS[op]}
                </label>
              ))}
            </div>
          </MobileSection>

          <div className="h-px bg-white/10 my-4" />

          <MobileSection label="숫자 범위">
            <div className="relative w-fit" data-drop>
              <button className={CTRL_BTN_CLS} onClick={() => toggleDrop('m-range')}>
                {RANGE_LABELS[range]} <span className="text-[9px] opacity-60">▾</span>
              </button>
              {openDrop === 'm-range' && (
                <div className={MENU_CLS}>
                  {(['1-9', '10-99', '1-99'] as Range[]).map(r => (
                    <div
                      key={r}
                      className={`${ITEM_CLS} ${range === r ? 'text-accent font-bold' : ''}`}
                      onClick={() => { onRangeChange(r); setOpenDrop(null) }}
                    >
                      {RANGE_LABELS[r]}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </MobileSection>

          <MobileSection label="페이지 수">
            <div className="relative w-fit" data-drop>
              <button className={CTRL_BTN_CLS} onClick={() => toggleDrop('m-pages')}>
                {pages}페이지 <span className="text-[9px] opacity-60">▾</span>
              </button>
              {openDrop === 'm-pages' && (
                <div className={MENU_CLS}>
                  {PAGE_COUNTS.map(p => (
                    <div
                      key={p}
                      className={`${ITEM_CLS} ${pages === p ? 'text-accent font-bold' : ''}`}
                      onClick={() => { onPagesChange(p); setOpenDrop(null) }}
                    >
                      {p}페이지
                    </div>
                  ))}
                </div>
              )}
            </div>
          </MobileSection>

          <div className="h-px bg-white/10 my-4" />

          <MobileSection label="타이머">
            <TimerWidget />
          </MobileSection>

          <div className="h-px bg-white/10 my-4" />

          <div className="flex items-center gap-2 flex-wrap">
            <SecretBtns withPrint />
          </div>

        </div>
      </div>
    </header>
  )
}

function MobileSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="text-[11px] font-bold text-white/40 tracking-[0.8px] uppercase mb-2">
        {label}
      </div>
      {children}
    </div>
  )
}
