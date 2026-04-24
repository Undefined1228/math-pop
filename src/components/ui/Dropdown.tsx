import type { ReactNode } from 'react'

export const MENU_CLS =
  'absolute top-[calc(100%+7px)] left-0 bg-white border border-stroke rounded-[8px] py-[6px] min-w-[136px] max-h-[60vh] overflow-y-auto overscroll-contain shadow-[0_10px_28px_rgba(0,0,0,0.18)] z-[300]'

export const ITEM_CLS =
  'flex items-center gap-[9px] px-[14px] py-2 text-[13.5px] text-text-base cursor-pointer hover:bg-cream'

export const CTRL_BTN_CLS =
  'h-[34px] px-3 rounded-[6px] border border-white/[0.18] bg-white/[0.08] text-white text-[13px] cursor-pointer flex items-center gap-[5px] whitespace-nowrap transition-[background] duration-[130ms] select-none hover:bg-white/[0.16] font-sans'

export interface DropdownItem {
  key: string | number
  label: string
  active?: boolean
}

interface Props {
  label: ReactNode
  open: boolean
  onToggle: () => void
  items: DropdownItem[]
  onSelect: (key: string | number) => void
  wide?: boolean
  disabled?: boolean
}

export default function Dropdown({ label, open, onToggle, items, onSelect, wide, disabled }: Props) {
  return (
    <div className="relative w-fit" data-drop>
      <button
        className={`${CTRL_BTN_CLS} ${wide ? 'min-w-[16rem] justify-between' : ''} disabled:opacity-40 disabled:cursor-not-allowed`}
        onClick={onToggle}
        disabled={disabled}
      >
        {label} <span className="text-[9px] opacity-60">▾</span>
      </button>
      {open && !disabled && (
        <div className={MENU_CLS}>
          {items.map(item => (
            <div
              key={item.key}
              className={`${ITEM_CLS} ${item.active ? 'text-accent font-bold' : ''}`}
              onClick={() => onSelect(item.key)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
