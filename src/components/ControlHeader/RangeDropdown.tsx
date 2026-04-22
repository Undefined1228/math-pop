import type { Range, Op } from '../../domain/types'
import { RANGE_LABELS, RANGE_ORDER, RANGE_OPS_SUPPORT } from '../../domain/labels'
import Dropdown from '../ui/Dropdown'

interface Props {
  range: Range
  ops: Op[]
  onRangeChange: (r: Range) => void
  onOpsChange: (ops: Op[]) => void
  open: boolean
  onToggle: () => void
  onClose: () => void
  showPrefix?: boolean
}

export default function RangeDropdown({
  range, ops, onRangeChange, onOpsChange, open, onToggle, onClose, showPrefix,
}: Props) {
  const handleRangeChange = (r: Range) => {
    const nextSupported = RANGE_OPS_SUPPORT[r]
    const filtered = ops.filter(o => nextSupported.includes(o))
    const nextOps = filtered.length === 0 ? [nextSupported[0]] : filtered
    if (
      nextOps.length !== ops.length ||
      nextOps.some((o, i) => o !== ops[i])
    ) {
      onOpsChange(nextOps)
    }
    onRangeChange(r)
  }

  return (
    <Dropdown
      label={showPrefix ? `범위: ${RANGE_LABELS[range]}` : RANGE_LABELS[range]}
      open={open}
      onToggle={onToggle}
      items={RANGE_ORDER.map(r => ({ key: r, label: RANGE_LABELS[r], active: range === r }))}
      onSelect={(key) => { handleRangeChange(key as Range); onClose() }}
      wide
    />
  )
}
