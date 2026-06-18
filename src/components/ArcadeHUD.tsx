import { ClarityBar } from './ClarityBar'
import { StageProgressRing } from './StageProgressRing'
import { comboPoints, isTruthMaster, nextComboPoints } from '../game/arcade/scoring'

export interface ArcadeHudState {
  clarity: number
  maxClarity: number
  dimming: boolean
  stageTitle: string
  stageColor: string
  mythsBusted: number
  mythsNeeded: number
  score: number
  combo: number
  xp: number
  gems: number
  badgeToast: string | null
  isFinal: boolean
}

interface ArcadeHUDProps {
  hud: ArcadeHudState
}

export function ArcadeHUD({ hud }: ArcadeHUDProps) {
  const xpPct = Math.min(100, hud.xp % 100)
  const truthMaster = isTruthMaster(hud.combo)

  return (
    <div className="arcade-hud">
      <ClarityBar clarity={hud.clarity} maxClarity={hud.maxClarity} dimming={hud.dimming} fixed />

      <div className="arcade-hud-row">
        <div className="arcade-hud-left">
          <span className="label-caps arcade-stage-label" style={{ color: hud.stageColor }}>
            {hud.stageTitle}
          </span>
          <StageProgressRing
            current={hud.mythsBusted}
            total={hud.mythsNeeded}
            color={hud.stageColor}
          />
        </div>
        <div className="arcade-hud-right">
          <div
            className={`arcade-combo ${hud.combo >= 3 ? 'arcade-combo--hot' : ''} ${truthMaster ? 'arcade-combo--master' : ''}`}
          >
            {hud.combo > 0 ? `${hud.combo}x` : '—'}
            <span>{truthMaster ? 'TRUTH MASTER!' : 'clarity streak'}</span>
          </div>
          <div className="arcade-gems">
            <strong>{hud.gems}</strong>
            <span>gems</span>
          </div>
          <div className="arcade-score">
            <strong>{hud.score}</strong>
            <span>pts</span>
          </div>
        </div>
      </div>

      {hud.combo > 0 && (
        <p className="arcade-combo-detail">
          Last bust: <strong>+{comboPoints(hud.combo)}</strong>
          {!truthMaster && (
            <>
              {' '}
              · Next: <strong>+{nextComboPoints(hud.combo)}</strong>
            </>
          )}
        </p>
      )}

      <div className="arcade-xp-track">
        <div className="arcade-xp-fill" style={{ width: `${xpPct}%` }} />
        <span className="arcade-xp-label">XP {hud.xp}</span>
      </div>

      {hud.badgeToast && (
        <div className="arcade-badge-toast" role="status">
          🏅 Achievement: {hud.badgeToast}
        </div>
      )}

      {hud.isFinal && (
        <p className="arcade-hint label-caps">Tap the golden myth to bust each part</p>
      )}
      {!hud.isFinal && (
        <p className="arcade-hint label-caps">Tap myths · Collect orbs · Build your streak</p>
      )}
    </div>
  )
}
