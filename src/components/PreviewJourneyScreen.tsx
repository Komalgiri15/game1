import type { CSSProperties } from 'react'
import type { AvatarId, DifficultyLevel } from '../game/types'
import { AVATARS, STAGES } from '../game/constants'
import { ClarityBar } from './ClarityBar'
import { JourneyPath } from './JourneyPath'
import { LogoMark } from './LogoMark'
import { SpiritArenaPreview } from './SpiritArenaPreview'
import { Button } from './Button'

interface PreviewJourneyScreenProps {
  avatarId: AvatarId
  difficulty: DifficultyLevel
  clarity: number
  maxClarity: number
  onBegin: () => void
  onBack: () => void
}

const TIPS = [
  { icon: '✦', label: 'Drag', detail: 'Move your type anywhere on the sky' },
  { icon: '○', label: 'Tap myths', detail: 'Bust bubbles to earn points & XP' },
  { icon: '●', label: 'Collect orbs', detail: 'Fly into facts — never tap them' },
] as const

export function PreviewJourneyScreen({
  avatarId,
  difficulty,
  clarity,
  maxClarity,
  onBegin,
  onBack,
}: PreviewJourneyScreenProps) {
  const spirit = AVATARS.find((a) => a.id === avatarId)

  return (
    <div className="screen screen--preview-journey">
      <LogoMark />

      <header className="preview-journey-header">
        <p className="label-caps preview-journey-eyebrow">Preview Journey</p>
        <h2 className="headline-md">Your path ahead</h2>
        <p className="body-md preview-journey-lead">
          Three stages of myth-busting, then <strong>The Final Truth</strong>.
          Your Clarity carries you through.
        </p>
      </header>

      <div className="preview-journey-hero">
        <SpiritArenaPreview avatarId={avatarId} tall showLegends />
        {spirit && (
          <div className="preview-journey-spirit-pill">
            <span className="preview-journey-spirit-name">{spirit.label}</span>
            <span className="preview-journey-spirit-desc">{spirit.description}</span>
          </div>
        )}
      </div>

      <div className="preview-journey-meta">
        <span className="preview-journey-badge preview-journey-badge--pace">
          {difficulty.label}
        </span>
        <span className="preview-journey-badge preview-journey-badge--clarity">
          {maxClarity} Clarity · {difficulty.timerLabel}
        </span>
      </div>

      <div className="preview-journey-tips">
        {TIPS.map((tip) => (
          <div key={tip.label} className="preview-journey-tip">
            <span className="preview-journey-tip-icon" aria-hidden>
              {tip.icon}
            </span>
            <div>
              <strong>{tip.label}</strong>
              <p>{tip.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <ClarityBar clarity={clarity} maxClarity={maxClarity} showHeader />

      <div className="preview-journey-stages">
        <JourneyPath stagesCleared={-1} finalUnlocked={false} />
        <ul className="preview-stage-cards">
          {STAGES.map((stage, i) => (
            <li
              key={stage.id}
              className="preview-stage-card"
              style={{ '--stage-accent': stage.stageColor } as CSSProperties}
            >
              <span className="preview-stage-num">{i + 1}</span>
              <div>
                <strong>{stage.title}</strong>
                <p>{stage.subtitle}</p>
                <span className="preview-stage-goal">
                  {stage.correctToClear} myths to clear
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <footer className="screen-footer screen-footer--dual preview-journey-footer">
        <Button onClick={onBack} variant="secondary">
          Back
        </Button>
        <Button onClick={onBegin}>Begin {STAGES[0].title}</Button>
      </footer>
    </div>
  )
}
