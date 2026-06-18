import type { Cloud } from './clouds'
import type { AvatarId, BustedMyth, FinalTruthPart, MythQuestion } from '../types'

export type EntityKind = 'myth' | 'fact' | 'boss'

export interface MythBubble {
  id: number
  kind: 'myth'
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  statement: string
  truth: string
  wobble: number
  wobblePhase: number
  dying: boolean
  dieTimer: number
  isBoss?: boolean
  bossPart?: number
}

export interface FactOrb {
  id: number
  kind: 'fact'
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  label: string
  truth: string
  wobblePhase: number
}

export type FloatingEntity = MythBubble | FactOrb

export interface Player {
  x: number
  y: number
  width: number
  height: number
  targetX: number
  targetY: number
  bobPhase: number
}

export interface FloatText {
  id: number
  x: number
  y: number
  text: string
  life: number
  color: string
}

export interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export interface MythPopup {
  statement: string
  truth: string
  timer: number
}

export interface FactToast {
  label: string
  truth: string
  timer: number
}

export interface BadgeToast {
  title: string
  timer: number
}

export interface ArcadeWorld {
  width: number
  height: number
  player: Player
  myths: MythBubble[]
  facts: FactOrb[]
  particles: Particle[]
  floatTexts: FloatText[]
  mythQueue: MythQuestion[]
  factQueue: { label: string; truth: string }[]
  spawnTimer: number
  factSpawnTimer: number
  mythsBusted: number
  mythsNeeded: number
  busted: BustedMyth[]
  clarity: number
  maxClarity: number
  score: number
  combo: number
  bestCombo: number
  xp: number
  gems: number
  badgesEarned: string[]
  dimming: boolean
  mythPopup: MythPopup | null
  factToast: FactToast | null
  badgeToast: BadgeToast | null
  pointerDown: boolean
  ended: boolean
  isFinal: boolean
  finalParts: FinalTruthPart[]
  finalPartIndex: number
  finalPartsCleared: number
  bossActive: boolean
  stageTitle: string
  stageColor: string
  stageColorDim: string
  stageIndex: number
  avatarId: import('../types').AvatarId
  difficultyId: import('../types').DifficultyId
  difficultySpeed: number
  difficultySpawn: number
  truthMasterShown: boolean
  clouds: Cloud[]
}

export function stageAvatarForm(stageIndex: number, isFinal: boolean): AvatarId {
  if (isFinal) return 'light'
  if (stageIndex === 0) return 'butterfly'
  if (stageIndex === 1) return 'lantern'
  return 'balloon'
}

export function effectiveAvatar(
  chosen: import('../types').AvatarId,
  stageIndex: number,
  isFinal: boolean,
): AvatarId {
  if (chosen !== 'guide') return chosen
  return stageAvatarForm(stageIndex, isFinal)
}

let _uid = 1
export const uid = () => _uid++

export function resetUid() {
  _uid = 1
}
