import type { AppMode } from '../../domain/types'

interface Props {
  appMode: AppMode
  onAppModeChange: (m: AppMode) => void
}

export default function AppModeToggle({ appMode, onAppModeChange }: Props) {
  return (
    <div className="inline-flex w-fit bg-white/[0.08] border border-white/[0.18] rounded-[6px] overflow-hidden shrink-0">
      {(['print', 'test'] as AppMode[]).map((m) => (
        <button
          key={m}
          onClick={() => onAppModeChange(m)}
          className={`h-[34px] px-[14px] border-0 text-[13px] cursor-pointer transition-all duration-150 whitespace-nowrap font-sans ${
            appMode === m
              ? 'bg-accent text-white font-bold'
              : 'bg-transparent text-white/55 hover:text-white/85'
          }`}
        >
          {m === 'print' ? '인쇄' : '테스트'}
        </button>
      ))}
    </div>
  )
}
