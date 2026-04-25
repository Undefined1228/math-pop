import type { AppMode } from '../../domain/types'

interface Props {
  appMode: AppMode
  onAppModeChange: (m: AppMode) => void
  disabled?: boolean
}

export default function AppModeToggle({ appMode, onAppModeChange, disabled }: Props) {
  return (
    <div className={`relative inline-grid grid-cols-2 bg-white/[0.08] border border-white/[0.18] rounded-[8px] p-[3px] shrink-0 ${disabled ? 'opacity-40' : ''}`}>
      <div
        className="absolute top-[3px] bottom-[3px] rounded-[5px] bg-accent transition-transform duration-200 ease-in-out"
        style={{
          left: '3px',
          width: 'calc(50% - 3px)',
          transform: appMode === 'test' ? 'translateX(100%)' : 'translateX(0)',
        }}
      />
      {(['print', 'test'] as AppMode[]).map((m) => (
        <button
          key={m}
          onClick={() => onAppModeChange(m)}
          disabled={disabled}
          className={`relative z-10 h-[30px] px-5 flex items-center justify-center text-[13px] font-sans border-0 bg-transparent whitespace-nowrap transition-colors duration-150 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${
            appMode === m ? 'text-white font-bold' : 'text-white/50 hover:text-white/80'
          }`}
        >
          {m === 'print' ? '연습(인쇄)' : '테스트'}
        </button>
      ))}
    </div>
  )
}
