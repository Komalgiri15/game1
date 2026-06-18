import type { BustedMyth, DifficultyId, FinalTruthPart } from '../types'
import { DIFFICULTY_SPAWN, DIFFICULTY_SPEED, MAX_ACTIVE_MYTHS, STAGES, stageSpeedMultiplier } from '../constants'
import { createClouds } from './clouds'
import { mythDrawPos } from './draw'
import { circleHit, clamp, pointInCircle } from './physics'
import {
  comboPoints,
  checkNewBadge,
  isTruthMaster,
  XP_PER_FACT,
  XP_PER_MYTH,
  GEMS_PER_FACT,
  GEMS_PER_MYTH,
} from './scoring'
import {
  buildFactQueue,
  buildMythQueue,
  spawnBoss,
  spawnFactOrb,
  spawnMythBubble,
  paletteIndexForColor,
  type SpawnObstacle,
} from './spawn'
import { drawWorld, spawnBurst } from './draw'
import type { ArcadeWorld, MythBubble } from './types'
import { resetUid, uid } from './types'
import type { AvatarId } from '../types'

export interface ArcadeCallbacks {
  onStageComplete: (idx: number, clarity: number, busted: BustedMyth[]) => void
  onFinalTruthComplete: (clarity: number, busted: BustedMyth[]) => void
  onClarityDepleted: (busted: BustedMyth[], duringFinal: boolean) => void
  onHudUpdate: (world: ArcadeWorld) => void
}

export interface CreateWorldOpts {
  width: number
  height: number
  stageIndex: number
  difficultyId: DifficultyId
  clarity: number
  maxClarity: number
  busted: BustedMyth[]
  avatarId: AvatarId
  isFinal: boolean
  finalParts: FinalTruthPart[]
}

export function createWorld(opts: CreateWorldOpts): ArcadeWorld {
  resetUid()
  const stage = STAGES[opts.stageIndex] ?? STAGES[0]
  const pw = 76
  const ph = 72
  const startX = opts.width / 2
  const startY = opts.height - ph - 48
  return {
    width: opts.width,
    height: opts.height,
    player: {
      x: startX - pw / 2,
      y: startY,
      width: pw,
      height: ph,
      targetX: startX,
      targetY: startY + ph / 2,
      bobPhase: 0,
    },
    myths: [],
    facts: [],
    particles: [],
    floatTexts: [],
    mythQueue: opts.isFinal ? [] : buildMythQueue(opts.stageIndex, opts.difficultyId),
    factQueue: buildFactQueue(),
    spawnTimer: 1.6,
    factSpawnTimer: 1.5,
    mythsBusted: 0,
    mythsNeeded: opts.isFinal ? opts.finalParts.length : stage.correctToClear,
    busted: [...opts.busted],
    clarity: opts.clarity,
    maxClarity: opts.maxClarity,
    score: 0,
    combo: 0,
    bestCombo: 0,
    xp: 0,
    gems: 0,
    badgesEarned: [],
    dimming: false,
    mythPopup: null,
    factToast: null,
    badgeToast: null,
    pointerDown: false,
    ended: false,
    isFinal: opts.isFinal,
    finalParts: opts.finalParts,
    finalPartIndex: 0,
    finalPartsCleared: 0,
    bossActive: false,
    stageTitle: opts.isFinal ? 'The Final Truth' : stage.title,
    stageColor: opts.isFinal ? '#d6a85c' : stage.stageColor,
    stageColorDim: opts.isFinal ? '#ffdead' : stage.stageColorDim,
    stageIndex: opts.stageIndex,
    avatarId: opts.avatarId,
    difficultyId: opts.difficultyId,
    difficultySpeed: DIFFICULTY_SPEED[opts.difficultyId] ?? 1,
    difficultySpawn: DIFFICULTY_SPAWN[opts.difficultyId] ?? 2,
    truthMasterShown: false,
    clouds: createClouds(opts.width, opts.height, 12),
    lastBubblePaletteIndex: -1,
  }
}

function effectiveDriftSpeed(world: ArcadeWorld): number {
  return world.difficultySpeed * stageSpeedMultiplier(world.stageIndex)
}

function popMyth(world: ArcadeWorld) {
  if (world.mythQueue.length === 0) {
    world.mythQueue = buildMythQueue(world.stageIndex, world.difficultyId)
  }
  return world.mythQueue.shift() ?? null
}

function popFact(world: ArcadeWorld) {
  if (world.factQueue.length === 0) world.factQueue = buildFactQueue()
  return world.factQueue.shift()!
}

function addFloatText(world: ArcadeWorld, x: number, y: number, text: string, color: string) {
  world.floatTexts.push({ id: uid(), x, y, text, life: 0.8, color })
}

function loseClarity(world: ArcadeWorld, cbs: ArcadeCallbacks) {
  world.clarity -= 1
  world.combo = 0
  world.dimming = true
  world.truthMasterShown = false
  if (world.isFinal && world.finalPartIndex >= 1) {
    world.finalPartIndex = 0
    world.finalPartsCleared = 0
    world.myths = []
    world.bossActive = false
    world.spawnTimer = 1.5
  }
  setTimeout(() => {
    world.dimming = false
  }, 900)
  if (world.clarity <= 0) {
    world.ended = true
    cbs.onClarityDepleted(world.busted, world.isFinal)
  }
}

function collectSpawnObstacles(world: ArcadeWorld): SpawnObstacle[] {
  const obstacles: SpawnObstacle[] = []
  for (const m of world.myths) {
    if (m.dying) continue
    obstacles.push({
      x: m.x + Math.sin(m.wobblePhase) * 4,
      y: m.y + Math.cos(m.wobblePhase * 0.55) * 2.5,
      radius: m.radius,
    })
  }
  for (const f of world.facts) {
    obstacles.push({ x: f.x, y: f.y, radius: f.radius })
  }
  return obstacles
}

function bustMyth(world: ArcadeWorld, myth: MythBubble, cbs: ArcadeCallbacks) {
  myth.dying = true
  myth.dieTimer = 0.4
  world.combo += 1
  world.bestCombo = Math.max(world.bestCombo, world.combo)
  const pts = comboPoints(world.combo)
  world.score += pts
  world.xp += XP_PER_MYTH
  world.gems += GEMS_PER_MYTH
  world.mythsBusted += 1

  addFloatText(world, myth.x, myth.y - 20, `+${pts}`, '#d6a85c')
  spawnBurst(world, myth.x, myth.y, myth.bubbleColor)

  const badge = checkNewBadge(world.combo, world.badgesEarned)
  if (badge) {
    world.badgesEarned.push(badge)
    world.badgeToast = { title: badge, timer: 2 }
  }
  if (isTruthMaster(world.combo) && !world.truthMasterShown) {
    world.truthMasterShown = true
    addFloatText(world, world.width / 2, world.height * 0.35, 'TRUTH MASTER!', '#d6a85c')
  }

  world.mythPopup = {
    statement: myth.statement,
    truth: myth.truth,
    timer: 1.6,
  }

  if (world.isFinal && myth.isBoss) {
    world.busted.push({
      statement: myth.statement,
      truth: myth.truth,
      stage: 'The Final Truth',
    })
    world.finalPartsCleared += 1
    if (world.finalPartsCleared >= world.finalParts.length) {
      world.ended = true
      cbs.onFinalTruthComplete(world.clarity, world.busted)
      return
    }
    world.finalPartIndex += 1
    world.bossActive = false
    world.myths = []
    world.spawnTimer = 1.2
    return
  }

  world.busted.push({
    statement: myth.statement,
    truth: myth.truth,
    stage: world.stageTitle,
  })

  if (!world.isFinal && world.mythsBusted >= world.mythsNeeded) {
    world.ended = true
    cbs.onStageComplete(world.stageIndex, world.clarity, world.busted)
  }
}

function collectFact(world: ArcadeWorld, factId: number) {
  const f = world.facts.find((x) => x.id === factId)
  if (!f) return
  world.facts = world.facts.filter((x) => x.id !== factId)
  world.xp += XP_PER_FACT
  world.gems += GEMS_PER_FACT
  world.score += 50
  addFloatText(world, f.x, f.y, '+50', '#7e9e7e')
  spawnBurst(world, f.x, f.y, '#7e9e7e', 8)
  world.factToast = { label: f.label, truth: f.truth, timer: 1.8 }
}

export function handleTap(world: ArcadeWorld, tx: number, ty: number, cbs: ArcadeCallbacks) {
  if (world.ended) return

  for (const m of world.myths) {
    if (m.dying) continue
    const pos = mythDrawPos(m)
    if (pointInCircle(tx, ty, pos.x, pos.y, m.radius)) {
      bustMyth(world, m, cbs)
      return
    }
  }

  for (const f of world.facts) {
    if (pointInCircle(tx, ty, f.x, f.y, f.radius)) {
      world.facts = world.facts.filter((x) => x.id !== f.id)
      loseClarity(world, cbs)
      addFloatText(world, f.x, f.y, 'Still Believed', '#e0935f')
      return
    }
  }
}

export function updateWorld(
  world: ArcadeWorld,
  dt: number,
  cbs: ArcadeCallbacks,
) {
  if (world.ended) return

  const p = world.player
  const lerp = 1 - Math.exp(-14 * dt)
  const cx = p.x + p.width / 2
  const cy = p.y + p.height / 2
  const newCx = cx + (p.targetX - cx) * lerp
  const newCy = cy + (p.targetY - cy) * lerp
  const minY = world.height * 0.32
  const maxY = world.height - p.height - 20
  p.x = clamp(newCx - p.width / 2, 10, world.width - p.width - 10)
  p.y = clamp(newCy - p.height / 2, minY, maxY)
  p.bobPhase += dt * 5

  if (world.mythPopup) {
    world.mythPopup.timer -= dt
    if (world.mythPopup.timer <= 0) world.mythPopup = null
  }
  if (world.factToast) {
    world.factToast.timer -= dt
    if (world.factToast.timer <= 0) world.factToast = null
  }
  if (world.badgeToast) {
    world.badgeToast.timer -= dt
    if (world.badgeToast.timer <= 0) world.badgeToast = null
  }

  world.myths = world.myths.filter((m) => {
    if (m.dying) {
      m.dieTimer -= dt
      return m.dieTimer > 0
    }
    if (!m.isBoss || world.bossActive) {
      if (!m.isBoss) {
        m.x += m.vx * dt
        m.y += m.vy * dt
        m.wobblePhase += m.wobble * dt
        m.spawnAge += dt
        m.x = clamp(m.x, m.radius, world.width - m.radius)
        if (m.x <= m.radius || m.x >= world.width - m.radius) m.vx *= -1
      }
    }

    const pcx = p.x + p.width / 2
    const pcy = p.y + p.height / 2
    const hitR = 32
    if (!m.isBoss) {
      const pos = mythDrawPos(m)
      if (circleHit(pos.x, pos.y, m.radius, pcx, pcy, hitR)) {
        loseClarity(world, cbs)
        return false
      }
    }
    return m.y < world.height + 80
  })

  world.facts = world.facts.filter((f) => {
    f.x += f.vx * dt
    f.y += f.vy * dt
    f.wobblePhase += dt * 2
    f.x = clamp(f.x, f.radius, world.width - f.radius)
    if (f.x <= f.radius || f.x >= world.width - f.radius) f.vx *= -1

    const pcx = p.x + p.width / 2
    const pcy = p.y + p.height / 2
    if (circleHit(f.x, f.y, f.radius, pcx, pcy, 28)) {
      collectFact(world, f.id)
      return false
    }
    return f.y < world.height + 60
  })

  world.particles = world.particles.filter((pt) => {
    pt.x += pt.vx * dt
    pt.y += pt.vy * dt
    pt.life -= dt
    return pt.life > 0
  })

  world.floatTexts = world.floatTexts.filter((ft) => {
    ft.y -= 30 * dt
    ft.life -= dt
    return ft.life > 0
  })

  if (!world.isFinal) {
    const activeMyths = world.myths.filter((m) => !m.dying)
    const activeCount = activeMyths.length
    if (activeCount < MAX_ACTIVE_MYTHS && world.mythsBusted < world.mythsNeeded) {
      world.spawnTimer -= dt
      if (world.spawnTimer <= 0) {
        const q = popMyth(world)
        if (q) {
          const usedPalette = activeMyths
            .map((m) => paletteIndexForColor(m.bubbleColor))
            .filter((i) => i >= 0)
          const bubble = spawnMythBubble(
            world.width,
            q,
            effectiveDriftSpeed(world),
            collectSpawnObstacles(world),
            undefined,
            undefined,
            false,
            world.lastBubblePaletteIndex,
            usedPalette,
            activeCount,
          )
          world.myths.push(bubble)
          const idx = paletteIndexForColor(bubble.bubbleColor)
          if (idx >= 0) world.lastBubblePaletteIndex = idx
          world.spawnTimer = activeCount >= 1 ? world.difficultySpawn * 0.85 : world.difficultySpawn
        }
      }
    }

    world.factSpawnTimer -= dt
    const maxFacts = activeCount > 0 ? 3 : 4
    if (world.factSpawnTimer <= 0 && world.facts.length < maxFacts) {
      world.facts.push(
        spawnFactOrb(
          world.width,
          popFact(world),
          effectiveDriftSpeed(world),
          collectSpawnObstacles(world),
          world.facts.length,
        ),
      )
      world.factSpawnTimer = world.difficultySpawn * 1.0
    }
  } else if (!world.bossActive && world.myths.length === 0) {
    world.spawnTimer -= dt
    if (world.spawnTimer <= 0) {
      const part = world.finalParts[world.finalPartIndex]
      if (part) {
        world.myths = [spawnBoss(world.width, world.height, part, world.finalPartIndex)]
        world.bossActive = true
      }
    }
  }

  cbs.onHudUpdate(world)
}

export function renderWorld(ctx: CanvasRenderingContext2D, world: ArcadeWorld) {
  drawWorld(ctx, world)
}
