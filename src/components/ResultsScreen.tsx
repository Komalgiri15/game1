import type { BustedMyth, ResultType, RunStats } from '../game/types'
import { getClosingReflection } from '../game/helpers'
import { Button } from './Button'
import { ClarityBar } from './ClarityBar'
import { JourneyPath } from './JourneyPath'
import { LogoMark } from './LogoMark'

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

const STAT_ITEMS = [
  { key: 'myths', label: 'Myths busted', value: (_s: RunStats, busted: number) => String(busted) },
  { key: 'combo', label: 'Best combo', value: (s: RunStats) => `${s.bestCombo}×` },
  { key: 'gems', label: 'Truth gems', value: (s: RunStats) => String(s.gems) },
  { key: 'score', label: 'Points', value: (s: RunStats) => String(s.score) },
  { key: 'xp', label: 'XP earned', value: (s: RunStats) => String(s.xp) },
] as const

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
  const clarityPct = maxClarity > 0 ? Math.round((clarity / maxClarity) * 100) : 0

  return (
    <div className="results-screen">
      <LogoMark />
      <div className="results-hero-glow" aria-hidden />

      <header className="results-hero">
        <div
          className={`results-outcome-badge ${isFull ? 'results-outcome-badge--full' : 'results-outcome-badge--partial'}`}
          aria-hidden
        >
          {isFull ? '✦' : '◇'}
        </div>
        <p className="label-caps results-eyebrow">Clarity report</p>
        <h2 className="headline-md results-title">
          {isFull ? 'Full Clarity' : 'Partial Clarity'}
        </h2>
        <p className="results-reflection">{reflection}</p>
        <p className="results-clarity-pill">
          Clarity remaining · <strong>{clarityPct}%</strong>
        </p>
      </header>

      <div className="results-stats-grid">
        {STAT_ITEMS.map((item) => (
            <div key={item.key} className={`results-stat-card results-stat-card--${item.key}`}>
              <strong>{item.value(runStats, bustedMyths.length)}</strong>
              <span>{item.label}</span>
            </div>
          ))}
      </div>

      {runStats.badgesEarned.length > 0 && (
        <section className="results-panel results-panel--badges">
          <h3 className="label-caps results-panel-title">Achievements unlocked</h3>
          <ul className="results-badge-list">
            {runStats.badgesEarned.map((b) => (
              <li key={b}>
                <span className="results-badge-icon" aria-hidden>
                  🏅
                </span>
                {b}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="results-panel results-panel--journey">
        <h3 className="label-caps results-panel-title">Your journey</h3>
        <JourneyPath
          stagesCleared={Math.max(-1, stagesCleared - 1)}
          finalUnlocked={reachedFinalTruth}
          finalCompleted={isFull}
          compact
        />
        <div className="results-clarity-wrap">
          <ClarityBar clarity={clarity} maxClarity={maxClarity} showHeader={false} />
        </div>
      </section>

      {bustedMyths.length > 0 && (
        <section className="results-panel results-panel--learned">
          <h3 className="label-caps results-panel-title">
            What you learned · {bustedMyths.length}
          </h3>
          <ul className="results-learned-list">
            {bustedMyths.map((m, i) => (
              <li key={i} className="results-learned-item">
                <span className="results-learned-stage">{m.stage}</span>
                <p className="results-learned-myth">{m.statement}</p>
                <p className="results-learned-truth">
                  <span className="results-learned-truth-label">Truth</span>
                  {m.truth}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="results-actions">
        {canGoDeeper && (
          <Button onClick={onGoDeeper} className="results-btn-primary">
            Go Deeper
          </Button>
        )}
        <Button
          onClick={onWalkAgain}
          variant={canGoDeeper ? 'secondary' : 'primary'}
          className={canGoDeeper ? undefined : 'results-btn-primary'}
        >
          Walk the Journey Again
        </Button>
      </footer>
    </div>
  )
}
