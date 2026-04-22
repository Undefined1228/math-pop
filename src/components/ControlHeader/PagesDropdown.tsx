import Dropdown from '../ui/Dropdown'

const PAGE_COUNTS = Array.from({ length: 10 }, (_, i) => i + 1)

interface Props {
  pages: number
  onPagesChange: (p: number) => void
  open: boolean
  onToggle: () => void
  onClose: () => void
}

export default function PagesDropdown({
  pages, onPagesChange, open, onToggle, onClose,
}: Props) {
  return (
    <Dropdown
      label={`${pages}페이지`}
      open={open}
      onToggle={onToggle}
      items={PAGE_COUNTS.map(p => ({ key: p, label: `${p}페이지`, active: pages === p }))}
      onSelect={(key) => { onPagesChange(key as number); onClose() }}
    />
  )
}
