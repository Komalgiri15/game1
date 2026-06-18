import type { DifficultyId } from '../game/types'
import { DIFFICULTY_LEVELS } from '../game/constants'

interface DifficultySelectProps {
  selected: DifficultyId | null
  onSelect: (id: DifficultyId) => void
}

export function DifficultySelect({ selected, onSelect }: DifficultySelectProps) {
  return (
    <div className="difficulty-select">
      {DIFFICULTY_LEVELS.map((level) => (
        <button
          key={level.id}
          type="button"
          className={`difficulty-card ${selected === level.id ? 'selected' : ''}`}
          onClick={() => onSelect(level.id)}
        >
          <div className="difficulty-card-header">
            <h3>{level.label}</h3>
          </div>
          <div className="difficulty-stats">
            <span className="difficulty-stat">
              <strong>{level.startingClarity}</strong> Clarity
            </span>
            <span className="difficulty-stat-divider" aria-hidden>·</span>
            <span className="difficulty-stat">
              <strong>{level.questionTime}s</strong> per myth
            </span>
            <span className="difficulty-stat-divider" aria-hidden>·</span>
            <span className="difficulty-stat">{level.timerLabel}</span>
          </div>
          <p>{level.description}</p>
        </button>
      ))}
    </div>
  )
}
