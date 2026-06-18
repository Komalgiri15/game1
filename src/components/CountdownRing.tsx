interface CountdownRingProps {
  timeLeft: number
  totalTime: number
  color?: string
  size?: number
}

export function CountdownRing({
  timeLeft,
  totalTime,
  color = 'var(--primary-container)',
  size = 280,
}: CountdownRingProps) {
  const stroke = 3
  const radius = (size - stroke * 2) / 2
  const circumference = 2 * Math.PI * radius
  const progress = totalTime > 0 ? timeLeft / totalTime : 0
  const offset = circumference * (1 - progress)

  return (
    <svg
      className="countdown-ring"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
    >
      <circle
        className="countdown-ring-track"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={stroke}
      />
      <circle
        className="countdown-ring-progress"
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
      />
    </svg>
  )
}
