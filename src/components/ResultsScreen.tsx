import type { BustedMyth, ResultType, RunStats } from '../game/types'
import { getClosingReflection } from '../game/helpers'
import { Button } from './Button'
import { ClarityBar } from './ClarityBar'
import { JourneyPath } from './JourneyPath'

interface ResultsScreenProps {
  resultType: ResultType
  bustedMyths: BustedMyth[]
  clarity: number
  maxClarity: number
  stagesCleared: number
  reachedFinalTruth: boolean
  runStats: RunStats
  canGoDeeper: boolean
  onGoDeeper: () => void
  onWalkAgain: () => void
}

export function ResultsScreen({
  resultType,
  bustedMyths,
  clarity,
  maxClarity,
  stagesCleared,
  reachedFinalTruth,
  runStats,
  canGoDeeper,
  onGoDeeper,
  onWalkAgain,
}: ResultsScreenProps) {
  const isFull = resultType === 'full'
  const reflection = getClosingReflection(
    resultType,
    stagesCleared,
    reachedFinalTruth,
  )

  return (
    <div className="results-screen">
      <p className="label-caps results-eyebrow">Clarity Report</p>
      <h2 className="headline-md">
        {isFull ? 'Full Clarity' : 'Partial Clarity'}
      </h2>

      <p className="results-reflection truth-highlight">{reflection}</p>

      <div className="results-journey-wrap">
        <span className="label-caps">Your journey</span>
        <JourneyPath
          stagesCleared={Math.max(-1, stagesCleared - 1)}
          finalUnlocked={reachedFinalTruth}
          finalCompleted={isFull}
          compact
        />
      </div>

      <ClarityBar clarity={clarity} maxClarity={maxClarity} />

      <div className="results-stats">
        <div className="results-stat">
          <strong>{bustedMyths.length}</strong>
          <span>myths busted</span>
        </div>
        <div className="results-stat">
          <strong>{runStats.bestCombo}</strong>
          <span>best combo</span>
        </div>
        <div className="results-stat">
          <strong>{runStats.gems}</strong>
          <span>truth gems</span>
        </div>
        <div className="results-stat">
          <strong>{runStats.score}</strong>
          <span>points</span>
        </div>
      </div>

      {runStats.badgesEarned.length > 0 && (
        <div className="results-badges">
          <span className="label-caps">Achievements</span>
          <ul>
            {runStats.badgesEarned.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      {bustedMyths.length > 0 && (
        <div className="busted-list">
          <span className="label-caps">What you learned</span>
          <ul>
            {bustedMyths.map((m, i) => (
              <li key={i}>
                <p className="busted-myth">{m.statement}</p>
                <p className="busted-truth">{m.truth}</p>
                <span className="busted-stage">{m.stage}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="results-actions results-actions--row">
        {canGoDeeper && <Button onClick={onGoDeeper}>Go Deeper</Button>}
        <Button onClick={onWalkAgain} variant={canGoDeeper ? 'secondary' : 'primary'}>
          Walk the Journey Again
        </Button>
      </div>
    </div>
  )
}
