import type { AvatarId } from '../game/types'
import { AVATARS } from '../game/constants'
import { SPIRIT_IMAGES } from '../game/spiritAssets'
import { AnimatedSkySvg } from './AnimatedSkySvg'
import { SpiritArenaPreview } from './SpiritArenaPreview'

interface AvatarSelectProps {
  selected: AvatarId
  onSelect: (id: AvatarId) => void
}

export function AvatarSelect({ selected, onSelect }: AvatarSelectProps) {
  return (
    <div className="avatar-select">
      <h2 className="headline-md section-title">Step 2 — Choose your type</h2>
      <p className="body-md section-sub">
        Pick who moves with you through the clouds. Tap myth bubbles only —
        collect truth orbs by moving into them.
      </p>

      <SpiritArenaPreview avatarId={selected} />

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
          </button>
        ))}
      </div>
    </div>
  )
}
