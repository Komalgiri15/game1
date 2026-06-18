import { useState } from 'react'
import { Button } from './Button'

interface GiftBoxProps {
  opened: boolean
  onOpen: () => void
}

/** SVG gift box — tap to open */
export function GiftBox({ opened, onOpen }: GiftBoxProps) {
  return (
    <button
      type="button"
      className={`gift-box ${opened ? 'gift-box--open' : ''}`}
      onClick={onOpen}
      disabled={opened}
      aria-label={opened ? 'Reward opened' : 'Open your reward gift box'}
    >
      <svg
        viewBox="0 0 120 120"
        className="gift-box-svg"
        aria-hidden
      >
        {/* Box base */}
        <rect
          x="18"
          y="52"
          width="84"
          height="52"
          rx="6"
          className="gift-box-base"
        />
        <rect x="18" y="52" width="84" height="14" rx="4" className="gift-box-lid-shadow" />

        {/* Lid — lifts when open */}
        <g className="gift-box-lid">
          <rect x="14" y="38" width="92" height="18" rx="5" className="gift-box-lid-top" />
          <rect x="54" y="38" width="12" height="18" className="gift-box-ribbon-v" />
        </g>

        {/* Vertical ribbon on box */}
        <rect x="54" y="52" width="12" height="52" className="gift-box-ribbon-v" />

        {/* Bow */}
        <g className="gift-box-bow">
          <ellipse cx="42" cy="36" rx="14" ry="10" className="gift-box-bow-loop" />
          <ellipse cx="78" cy="36" rx="14" ry="10" className="gift-box-bow-loop" />
          <circle cx="60" cy="38" r="8" className="gift-box-bow-knot" />
        </g>

        {/* Sparkle burst when open */}
        <g className="gift-box-sparkles" opacity={opened ? 1 : 0}>
          <circle cx="60" cy="20" r="3" fill="#FFDEAD" />
          <circle cx="40" cy="28" r="2" fill="#D6A85C" />
          <circle cx="80" cy="26" r="2.5" fill="#FFF8F4" />
          <circle cx="30" cy="50" r="2" fill="#FFB0C9" />
          <circle cx="90" cy="48" r="2" fill="#FFDEAD" />
          <path
            d="M60 8 L62 16 L70 16 L64 21 L66 29 L60 24 L54 29 L56 21 L50 16 L58 16 Z"
            fill="#D6A85C"
          />
        </g>

        {/* Inner glow when open */}
        <ellipse
          cx="60"
          cy="72"
          rx="28"
          ry="16"
          className="gift-box-glow"
          opacity={opened ? 0.9 : 0}
        />
      </svg>
      {!opened && <span className="gift-box-hint label-caps">Tap to open</span>}
    </button>
  )
}

interface GiftRewardPanelProps {
  points: number
  xp: number
  gems: number
  highlights: string[]
}

export function GiftRewardPanel({ points, xp, gems, highlights }: GiftRewardPanelProps) {
  return (
    <div className="gift-reward-panel" role="status">
      <p className="label-caps gift-reward-eyebrow">You earned</p>
      <div className="gift-reward-stats">
        <div className="gift-reward-stat">
          <strong>+{points}</strong>
          <span>points</span>
        </div>
        <div className="gift-reward-stat">
          <strong>+{gems}</strong>
          <span>Truth Gems</span>
        </div>
        <div className="gift-reward-stat">
          <strong>+{xp}</strong>
          <span>XP</span>
        </div>
      </div>
      <ul className="gift-reward-highlights">
        {highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </div>
  )
}

interface GiftBoxFlowProps {
  bonus: { points: number; xp: number; gems: number; highlights: string[] }
  onClaim: () => void
  onContinue: () => void
}

export function GiftBoxFlow({ bonus, onClaim, onContinue }: GiftBoxFlowProps) {
  const [opened, setOpened] = useState(false)
  const [claimed, setClaimed] = useState(false)

  const handleOpen = () => {
    if (opened) return
    setOpened(true)
    if (!claimed) {
      onClaim()
      setClaimed(true)
    }
  }

  return (
    <div className="gift-box-flow">
      <GiftBox opened={opened} onOpen={handleOpen} />
      {opened && (
        <>
          <GiftRewardPanel {...bonus} />
          <Button onClick={onContinue} className="gift-continue-btn">
            Continue Journey
          </Button>
        </>
      )}
    </div>
  )
}
