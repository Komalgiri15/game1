import { useMemo } from 'react'
import type { RunStats } from '../game/types'
import { calculateStageGiftBonus } from '../game/arcade/scoring'
import { GiftBoxFlow } from './GiftBox'
import { JourneyPath } from './JourneyPath'

interface StageClearTransitionProps {
  banner: string
  clearedStageIndex: number
  clarity: number
  runStats: RunStats
  onClaimBonus: (bonus: ReturnType<typeof calculateStageGiftBonus>) => void
  onComplete: () => void
}

export function StageClearTransition({
  banner,
  clearedStageIndex,
  clarity,
  runStats,
  onClaimBonus,
  onComplete,
}: StageClearTransitionProps) {
  const bonus = useMemo(
    () => calculateStageGiftBonus(clearedStageIndex, runStats, clarity),
    [clearedStageIndex, runStats, clarity],
  )

  return (
    <div className="stage-clear" role="dialog" aria-label="Stage complete">
      <div className="stage-clear-sunrise" aria-hidden />
      <div className="stage-clear-content">
        <p className="label-caps stage-clear-eyebrow">Stage Clear</p>
        <h2 className="headline-md stage-clear-banner">{banner}</h2>

        <JourneyPath
          stagesCleared={clearedStageIndex}
          animateProgressTo={clearedStageIndex}
        />

        <p className="body-md stage-clear-sub">
          Myths busted: {runStats.mythsBusted} · Best combo: {runStats.bestCombo}x
          {runStats.bestCombo >= 5 ? ' · TRUTH MASTER!' : ''}
        </p>

        <GiftBoxFlow
          bonus={bonus}
          onClaim={() => onClaimBonus(bonus)}
          onContinue={onComplete}
        />
      </div>
    </div>
  )
}
