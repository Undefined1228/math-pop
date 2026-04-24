import type { Mode } from '../../domain/types'

interface Props {
  mode: Mode
  onModeChange: (m: Mode) => void
}

export default function ModeToggle({ mode, onModeChange }: Props) {
  return (
    <div className="inline-flex w-fit bg-white/[0.08] border border-white/[0.18] rounded-[6px] overflow-hidden shrink-0">
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
}
