interface StageProgressRingProps {
  current: number
  total: number
  color?: string
  size?: number
}

export function StageProgressRing({
  current,
  total,
  color = 'var(--primary-container)',
  size = 48,
}: StageProgressRingProps) {
  const stroke = 3
  const radius = (size - stroke * 2) / 2
  const circumference = 2 * Math.PI * radius
  const progress = total > 0 ? current / total : 0
  const offset = circumference * (1 - progress)

  return (
    <div className="stage-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          className="stage-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          style={{ stroke: color, opacity: 0.12 }}
        />
        <circle
          className="stage-ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <span className="stage-ring-label">
        {current}/{total}
      </span>
    </div>
  )
}
