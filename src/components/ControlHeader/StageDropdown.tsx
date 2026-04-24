import type { Stage } from '../../domain/types'
import { STAGE_PRESETS } from '../../domain/stage'
import Dropdown from '../ui/Dropdown'

const STAGES = Array.from({ length: 11 }, (_, i) => (i + 1) as Stage)

interface Props {
  stage: Stage
  onStageChange: (s: Stage) => void
  open: boolean
  onToggle: () => void
  onClose: () => void
}

export default function StageDropdown({ stage, onStageChange, open, onToggle, onClose }: Props) {
  return (
    <Dropdown
      label={STAGE_PRESETS[stage].label}
      open={open}
      onToggle={onToggle}
      items={STAGES.map(s => ({ key: s, label: STAGE_PRESETS[s].label, active: stage === s }))}
      onSelect={(key) => { onStageChange(key as Stage); onClose() }}
      wide
    />
  )
}
