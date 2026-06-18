import type { AvatarId } from '../game/types'
import { AVATARS } from '../game/constants'
import { SPIRIT_IMAGES } from '../game/spiritAssets'
import { AnimatedSkySvg } from './AnimatedSkySvg'
import { SpiritArenaPreview } from './SpiritArenaPreview'

interface AvatarSelectProps {
  selected: AvatarId
  onSelect: (id: AvatarId) => void
}

const LEGEND = [
  { key: 'drag', label: 'Drag to move' },
  { key: 'tap', label: 'Tap myths' },
  { key: 'orb', label: 'Collect orbs' },
] as const

export function AvatarSelect({ selected, onSelect }: AvatarSelectProps) {
  const active = AVATARS.find((a) => a.id === selected)

  return (
    <div className="avatar-select">
      <ul className="avatar-legend" aria-label="How to play">
          {LEGEND.map((item) => (
            <li key={item.key} className="avatar-legend-chip">
              {item.label}
            </li>
          ))}
        </ul>

      <SpiritArenaPreview avatarId={selected} tall showLegends />

      <div className="spirit-card-grid" role="listbox" aria-label="Type options">
        {AVATARS.map((a) => (
          <button
            key={a.id}
            type="button"
            role="option"
            className={`spirit-card ${selected === a.id ? 'spirit-card--selected' : ''}`}
            onClick={() => onSelect(a.id)}
            title={a.description}
            aria-pressed={selected === a.id}
            aria-label={`${a.label}. ${a.description}`}
          >
            <div className="spirit-card-art">
              <AnimatedSkySvg variant={a.id} className="spirit-card-sky" />
              <img
                src={SPIRIT_IMAGES[a.id]}
                alt=""
                className="spirit-card-img"
                draggable={false}
              />
            </div>
            <span className="spirit-card-label">{a.label}</span>
            {selected === a.id && (
              <span className="spirit-card-check" aria-hidden>
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      {active && (
        <p className="avatar-selected-desc">
          <strong>{active.label}</strong> — {active.description}
        </p>
      )}
    </div>
  )
}
