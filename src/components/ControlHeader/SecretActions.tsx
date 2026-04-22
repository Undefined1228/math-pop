interface Props {
  onShowAnswer: () => void
  onGrade: () => void
  onPrintAnswer: () => void
  onStopTimer: () => void
  withPrint?: boolean
}

export default function SecretActions({
  onShowAnswer, onGrade, onPrintAnswer, onStopTimer, withPrint = false,
}: Props) {
  const actions = [
    { title: '정답보기', icon: '👁', fn: onShowAnswer },
    { title: '채점', icon: '✓', fn: onGrade },
    ...(withPrint ? [] : [{ title: '정답지 인쇄', icon: '🖨', fn: onPrintAnswer }]),
    { title: '타이머 정지', icon: '⏸', fn: onStopTimer },
  ]

  return (
    <div className="flex items-center gap-[3px]">
      {withPrint && (
        <button
          className="h-[34px] px-[14px] rounded-[6px] border border-white/25 bg-transparent text-white text-[13px] cursor-pointer flex items-center gap-[6px] font-sans transition-[background] duration-[130ms] hover:bg-white/10"
          onClick={() => window.print()}
        >
          🖨 인쇄
        </button>
      )}
      {actions.map(({ title, icon, fn }) => (
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
}
