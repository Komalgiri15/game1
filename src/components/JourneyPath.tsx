import type { CSSProperties } from 'react'
import { STAGES } from '../game/constants'

interface JourneyPathProps {
  stagesCleared: number
  finalUnlocked?: boolean
  finalCompleted?: boolean
  animateProgressTo?: number
  compact?: boolean
}

export function JourneyPath({
  stagesCleared,
  finalUnlocked = false,
  finalCompleted = false,
  animateProgressTo,
  compact = false,
}: JourneyPathProps) {
  const progressEnd =
    animateProgressTo !== undefined ? animateProgressTo : stagesCleared

  let fillPct = 0
  if (finalCompleted) fillPct = 100
  else if (finalUnlocked) fillPct = 75
  else if (progressEnd >= 0) fillPct = ((progressEnd + 1) / 4) * 100

  return (
    <div className={`journey-path ${compact ? 'journey-path--compact' : ''}`}>
      <div className="journey-path-track">
        <div className="journey-path-fill" style={{ width: `${fillPct}%` }} />
      </div>
      <ol className="journey-path-nodes">
        {STAGES.map((stage, i) => {
          const cleared = i <= stagesCleared
          const active = i === stagesCleared + 1 && !finalUnlocked && !finalCompleted
          return (
            <li
              key={stage.id}
              className={`journey-node ${cleared ? 'cleared' : ''} ${active ? 'active' : ''}`}
            >
              <span
                className="journey-node-dot"
                style={{ '--node-color': stage.stageColor } as CSSProperties}
              />
              <span className="journey-node-label">{stage.title}</span>
            </li>
          )
        })}
        <li
          className={`journey-node journey-node--final ${finalUnlocked || finalCompleted ? 'unlocked' : 'locked'} ${finalCompleted ? 'cleared' : ''}`}
        >
          <span className="journey-node-dot journey-node-dot--gold" />
          <span className="journey-node-label">Final Truth</span>
          {!finalUnlocked && !finalCompleted && (
            <span className="journey-lock" aria-hidden>
              🔒
            </span>
          )}
        </li>
      </ol>
    </div>
  )
}
