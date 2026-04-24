import type { TestResult } from '../domain/types'
import { STAGE_PRESETS } from '../domain/stage'

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

interface Props {
  result: TestResult
  onRetry: () => void
  onRetryWrong: () => void
  onChangeStage: () => void
  onSwitchToPrint: () => void
}

export default function TestResultModal({
  result, onRetry, onRetryWrong, onChangeStage, onSwitchToPrint,
}: Props) {
  const { stage, correct, total, elapsedSec, passed, wrongIndices } = result
  const pct = Math.round((correct / total) * 100)

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 print:hidden">
      <div className="bg-paper rounded-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.35)] w-[92%] max-w-[420px] overflow-hidden">

        <div className={`px-6 py-5 ${passed ? 'bg-green-600' : 'bg-red-600'}`}>
          <div className="text-white/70 text-[12px] font-bold tracking-[0.6px] mb-1">
            {STAGE_PRESETS[stage].label}
          </div>
          <div className="text-white text-[30px] font-bold tracking-[-0.5px]">
            {passed ? '합격' : '불합격'}
          </div>
        </div>

        <div className="px-6 py-5 grid grid-cols-3 gap-4 border-b border-stroke">
          <Stat label="정답 수" value={`${correct} / ${total}`} />
          <Stat label="정답률" value={`${pct}%`} highlight={passed} />
          <Stat label="소요 시간" value={fmt(elapsedSec)} />
        </div>

        <div className="px-6 py-4 flex flex-col gap-2">
          <button
            className="h-[42px] rounded-[8px] bg-accent text-white text-[14px] font-bold cursor-pointer transition-[background] duration-[130ms] hover:bg-accent-h"
            onClick={onRetry}
          >
            다시 시도
          </button>
          <button
            className="h-[42px] rounded-[8px] border border-stroke text-text-base text-[14px] font-bold cursor-pointer transition-[background] duration-[130ms] hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={onRetryWrong}
            disabled={wrongIndices.length === 0}
          >
            틀린 문제만 다시 풀기 ({wrongIndices.length}문제)
          </button>
          <div className="flex gap-2">
            <button
              className="flex-1 h-[38px] rounded-[8px] border border-stroke text-text-base text-[13px] cursor-pointer transition-[background] duration-[130ms] hover:bg-cream"
              onClick={onChangeStage}
            >
              단계 변경
            </button>
            <button
              className="flex-1 h-[38px] rounded-[8px] border border-stroke text-text-base text-[13px] cursor-pointer transition-[background] duration-[130ms] hover:bg-cream"
              onClick={onSwitchToPrint}
            >
              인쇄 모드로
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <div className="text-[11px] text-muted font-bold tracking-[0.5px] mb-1">{label}</div>
      <div className={`text-[18px] font-bold ${highlight ? 'text-accent' : 'text-text-base'}`}>{value}</div>
    </div>
  )
}
