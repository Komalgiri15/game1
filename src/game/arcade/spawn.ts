import { FACT_ORBS, MYTH_BUBBLE_PALETTE } from '../constants'
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

export interface SpawnObstacle {
  x: number
  y: number
  radius: number
}

function circlesOverlap(
  ax: number,
  ay: number,
  ar: number,
  bx: number,
  by: number,
  br: number,
  gap = 32,
): boolean {
  const dx = ax - bx
  const dy = ay - by
  const minDist = ar + br + gap
  return dx * dx + dy * dy < minDist * minDist
}

export function pickSpawnX(
  w: number,
  r: number,
  y: number,
  obstacles: SpawnObstacle[],
): number {
  const minX = r + 10
  const maxX = w - r - 10
  const lanes = [0.22, 0.38, 0.5, 0.62, 0.78]
  const attempts = lanes.map((lane) => minX + (maxX - minX) * lane)
  for (let i = 0; i < 10; i++) {
    attempts.push(minX + Math.random() * (maxX - minX))
  }
  for (const x of attempts) {
    if (!obstacles.some((o) => circlesOverlap(x, y, r, o.x, o.y, o.radius))) {
      return x
    }
  }
  return w / 2
}

export function mythBubbleRadius(w: number, isBoss = false): number {
  const base = Math.min(68, Math.max(52, w * 0.14))
  return isBoss ? Math.round(base * 1.35) : base
}

export function pickBubblePalette(
  lastIndex = -1,
  excludeIndices: number[] = [],
): {
  color: string
  dim: string
  halo: string
  index: number
} {
  let pool = MYTH_BUBBLE_PALETTE.map((_, i) => i).filter(
    (i) => !excludeIndices.includes(i),
  )
  if (lastIndex >= 0 && pool.length > 1) {
    pool = pool.filter((i) => i !== lastIndex)
  }
  if (pool.length === 0) {
    pool = MYTH_BUBBLE_PALETTE.map((_, i) => i).filter((i) => i !== lastIndex)
  }
  const index = pool[Math.floor(Math.random() * pool.length)] ?? 0
  const entry = MYTH_BUBBLE_PALETTE[index]
  return { ...entry, index }
}

export function paletteIndexForColor(color: string): number {
  return MYTH_BUBBLE_PALETTE.findIndex((p) => p.color === color)
}

export function spawnMythBubble(
  w: number,
  q: MythQuestion,
  speedMul: number,
  obstacles: SpawnObstacle[] = [],
  yStart?: number,
  radius?: number,
  isBoss = false,
  lastPaletteIndex = -1,
  excludePaletteIndices: number[] = [],
  stackIndex = 0,
): MythBubble {
  const r = radius ?? mythBubbleRadius(w, isBoss)
  const startY = yStart ?? -(r * 1.1) - stackIndex * (r * 1.8)
  const x = isBoss ? w / 2 : pickSpawnX(w, r, startY, obstacles)
  const palette = isBoss
    ? { color: '#d6a85c', dim: '#ffdead', halo: 'rgba(255, 222, 173, 0.22)', index: -1 }
    : pickBubblePalette(lastPaletteIndex, excludePaletteIndices)
  return {
    id: uid(),
    kind: 'myth',
    x,
    y: startY,
    vx: (Math.random() - 0.5) * 22 * speedMul,
    vy: (26 + Math.random() * 16) * speedMul,
    radius: r,
    statement: q.statement,
    truth: q.truth,
    wobble: 0.9 + Math.random() * 1.1,
    wobblePhase: Math.random() * Math.PI * 2,
    spawnAge: 0,
    spawnDuration: isBoss ? 0.5 : 0.8,
    dying: false,
    dieTimer: 0,
    isBoss,
    bubbleColor: palette.color,
    bubbleColorDim: palette.dim,
    bubbleHalo: palette.halo,
  }
}

export function spawnFactOrb(
  w: number,
  data: { label: string; truth: string },
  speedMul: number,
  obstacles: SpawnObstacle[] = [],
  stackIndex = 0,
): FactOrb {
  const r = 32
  const y = -48 - stackIndex * 72
  return {
    id: uid(),
    kind: 'fact',
    x: pickSpawnX(w, r, y, obstacles),
    y,
    vx: (Math.random() - 0.5) * 22 * speedMul,
    vy: (32 + Math.random() * 16) * speedMul,
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
    ...spawnMythBubble(w, part, 0.4, [], h * 0.22, bossR, true),
    x: w / 2,
    y: h * 0.28,
    vx: 0,
    vy: 0,
    bossPart: partIndex,
  }
}
