interface Props {
  remaining: number
  duration: number
  running: boolean
}

export default function TimerAlertOverlay({ remaining, duration, running }: Props) {
  if (!running || remaining <= 0 || duration <= 0) return null

  const ratio = remaining / duration
  if (ratio > 0.2) return null

  const danger = ratio < 0.05
  const color = danger ? 'rgba(220, 38, 38, 0.55)' : 'rgba(251, 146, 60, 0.45)'
  const spread = danger ? 22 : 15
  const blur = danger ? 90 : 70
  const animation = danger
    ? 'timer-edge-danger 0.7s ease-in-out infinite'
    : 'timer-edge-warn 1.3s ease-in-out infinite'

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[90] print:hidden"
      style={{
        boxShadow: `inset 0 0 ${blur}px ${spread}px ${color}`,
        animation,
      }}
    />
  )
}
