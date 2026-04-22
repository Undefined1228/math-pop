import type { Op, Range } from '../../domain/types'
import { OP_LABELS, ALL_OPS, RANGE_LABELS, RANGE_OPS_SUPPORT } from '../../domain/labels'
import { MENU_CLS, ITEM_CLS, CTRL_BTN_CLS } from '../ui/Dropdown'

interface Props {
  range: Range
  ops: Op[]
  onOpsChange: (ops: Op[]) => void
  open: boolean
  onToggle: () => void
}

export default function OpsDropdown({ range, ops, onOpsChange, open, onToggle }: Props) {
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
    <div className="relative w-fit" data-drop>
      <button className={CTRL_BTN_CLS} onClick={onToggle}>
        연산{' '}
        <span className="bg-accent text-white text-[11px] font-bold px-[5px] py-[1px] rounded-[10px] leading-[1.4]">
          {ops.length}
        </span>
        <span className="text-[9px] opacity-60">▾</span>
      </button>
      {open && (
        <div className={MENU_CLS}>
          {ALL_OPS.map(op => {
            const enabled = isOpEnabled(op)
            return (
              <label
                key={op}
                title={opTooltip(op)}
                className={`${ITEM_CLS} transition-opacity duration-150 ${ops.includes(op) ? 'text-accent font-bold' : ''} ${enabled ? '' : 'opacity-40 cursor-not-allowed hover:bg-transparent'}`}
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
      )}
    </div>
  )
}
