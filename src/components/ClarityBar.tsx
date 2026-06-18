interface ClarityBarProps {
  clarity: number
  maxClarity: number
  dimming?: boolean
  showHeader?: boolean
  fixed?: boolean
}

export function ClarityBar({
  clarity,
  maxClarity,
  dimming = false,
  showHeader = true,
  fixed = false,
}: ClarityBarProps) {
  const pct = maxClarity > 0 ? (clarity / maxClarity) * 100 : 0

  return (
    <div
      className={`clarity-bar-wrap ${fixed ? 'clarity-bar-wrap--fixed' : ''}`}
      aria-label={`Clarity: ${clarity} of ${maxClarity}`}
    >
      {showHeader && (
        <div className="clarity-bar-header">
          <span className="label-caps">Clarity</span>
          <span className="clarity-value">
            {clarity} / {maxClarity}
          </span>
        </div>
      )}
      <div className={`clarity-bar-track ${dimming ? 'dimming' : ''}`}>
        <div
          className="clarity-bar-fill"
          style={{ width: `${pct}%` }}
        />
        <div
          className="clarity-bar-glow"
          style={{ left: `calc(${Math.max(4, pct)}% - 8px)` }}
        />
      </div>
    </div>
  )
}
