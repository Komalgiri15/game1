import { FACT_ORBS } from '../constants'
import { getQuestionsForStage } from '../helpers'
import type { DifficultyId, FinalTruthPart, MythQuestion } from '../types'
import type { FactOrb, MythBubble } from './types'
import { uid } from './types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildMythQueue(
  stageIndex: number,
  difficultyId: DifficultyId,
): MythQuestion[] {
  return shuffle(getQuestionsForStage(stageIndex, difficultyId))
}

export function buildFactQueue(): { label: string; truth: string }[] {
  return shuffle(FACT_ORBS.map((f) => ({ label: f.label, truth: f.truth })))
}

export function mythBubbleRadius(w: number, isBoss = false): number {
  const base = Math.min(72, Math.max(56, w * 0.15))
  return isBoss ? Math.round(base * 1.35) : base
}

export function spawnMythBubble(
  w: number,
  q: MythQuestion,
  speedMul: number,
  yStart = -80,
  radius?: number,
  isBoss = false,
): MythBubble {
  const r = radius ?? mythBubbleRadius(w, isBoss)
  return {
    id: uid(),
    kind: 'myth',
    x: r + Math.random() * (w - r * 2),
    y: yStart,
    vx: (Math.random() - 0.5) * 30 * speedMul,
    vy: (35 + Math.random() * 25) * speedMul,
    radius: r,
    statement: q.statement,
    truth: q.truth,
    wobble: 2 + Math.random() * 3,
    wobblePhase: Math.random() * Math.PI * 2,
    dying: false,
    dieTimer: 0,
    isBoss,
  }
}

export function spawnFactOrb(
  w: number,
  data: { label: string; truth: string },
  speedMul: number,
): FactOrb {
  const r = 32
  return {
    id: uid(),
    kind: 'fact',
    x: r + Math.random() * (w - r * 2),
    y: -40,
    vx: (Math.random() - 0.5) * 20 * speedMul,
    vy: (22 + Math.random() * 12) * speedMul,
    radius: r,
    label: data.label,
    truth: data.truth,
    wobblePhase: Math.random() * Math.PI * 2,
  }
}

export function spawnBoss(
  w: number,
  h: number,
  part: FinalTruthPart,
  partIndex: number,
): MythBubble {
  const bossR = mythBubbleRadius(w, true)
  return {
    ...spawnMythBubble(w, part, 0.4, h * 0.22, bossR, true),
    x: w / 2,
    y: h * 0.28,
    vx: 0,
    vy: 0,
    bossPart: partIndex,
  }
}
