import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  AvatarId,
  BustedMyth,
  DifficultyId,
  FinalTruthPart,
  RunStats,
} from '../game/types'
import { DIFFICULTY_LEVELS } from '../game/constants'
import {
  createWorld,
  handleTap,
  renderWorld,
  updateWorld,
  type ArcadeCallbacks,
} from '../game/arcade/engine'
import { createClouds } from '../game/arcade/clouds'
import type { ArcadeWorld } from '../game/arcade/types'
import { AnimatedSkySvg } from '../components/AnimatedSkySvg'
import { ArcadeHUD, type ArcadeHudState } from '../components/ArcadeHUD'
import { FactToast } from '../components/FactToast'
import { MythBustPopup } from '../components/MythBustPopup'

type PlayMode = 'stage' | 'final-truth'

interface ArcadeGameplayScreenProps {
  difficultyId: DifficultyId
  mode: PlayMode
  avatarId: AvatarId
  initialStageIndex?: number
  initialClarity?: number
  initialBusted?: BustedMyth[]
  initialStats?: Partial<RunStats>
  finalTruthParts: FinalTruthPart[]
  onStageComplete: (
    idx: number,
    clarity: number,
    busted: BustedMyth[],
    stats: RunStats,
  ) => void
  onFinalTruthComplete: (clarity: number, busted: BustedMyth[], stats: RunStats) => void
  onClarityDepleted: (
    busted: BustedMyth[],
    duringFinal: boolean,
    stats: RunStats,
  ) => void
}

const defaultHud: ArcadeHudState = {
  clarity: 5,
  maxClarity: 5,
  dimming: false,
  stageTitle: '',
  stageColor: '#b5577a',
  mythsBusted: 0,
  mythsNeeded: 3,
  score: 0,
  combo: 0,
  xp: 0,
  gems: 0,
  badgeToast: null,
  isFinal: false,
}

function worldToStats(w: ArcadeWorld): RunStats {
  return {
    score: w.score,
    combo: w.combo,
    bestCombo: w.bestCombo,
    xp: w.xp,
    gems: w.gems,
    mythsBusted: w.mythsBusted,
    badgesEarned: [...w.badgesEarned],
  }
}

function worldToHud(w: ArcadeWorld): ArcadeHudState {
  return {
    clarity: w.clarity,
    maxClarity: w.maxClarity,
    dimming: w.dimming,
    stageTitle: w.stageTitle,
    stageColor: w.stageColor,
    mythsBusted: w.mythsBusted,
    mythsNeeded: w.mythsNeeded,
    score: w.score,
    combo: w.combo,
    xp: w.xp,
    gems: w.gems,
    badgeToast: w.badgeToast?.title ?? null,
    isFinal: w.isFinal,
  }
}

export function ArcadeGameplayScreen({
  difficultyId,
  mode,
  avatarId,
  initialStageIndex = 0,
  initialClarity,
  initialBusted = [],
  initialStats,
  finalTruthParts,
  onStageComplete,
  onFinalTruthComplete,
  onClarityDepleted,
}: ArcadeGameplayScreenProps) {
  const difficulty = DIFFICULTY_LEVELS.find((d) => d.id === difficultyId)!
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<ArcadeWorld | null>(null)
  const initializedRef = useRef(false)
  const lastTsRef = useRef(0)
  const animRef = useRef(0)
  const dragRef = useRef(false)
  const tapStartRef = useRef<{ x: number; y: number; t: number } | null>(null)

  const [hud, setHud] = useState<ArcadeHudState>(defaultHud)
  const [mythPopup, setMythPopup] = useState<{ statement: string; truth: string } | null>(
    null,
  )
  const [factToast, setFactToast] = useState<{ label: string; truth: string } | null>(null)

  const callbacksRef = useRef<ArcadeCallbacks>({
    onStageComplete: () => {},
    onFinalTruthComplete: () => {},
    onClarityDepleted: () => {},
    onHudUpdate: () => {},
  })

  callbacksRef.current = {
    onStageComplete: (idx, clarity, busted) => {
      const w = worldRef.current!
      onStageComplete(idx, clarity, busted, worldToStats(w))
    },
    onFinalTruthComplete: (clarity, busted) => {
      const w = worldRef.current!
      onFinalTruthComplete(clarity, busted, worldToStats(w))
    },
    onClarityDepleted: (busted, duringFinal) => {
      const w = worldRef.current!
      onClarityDepleted(busted, duringFinal, worldToStats(w))
    },
    onHudUpdate: (w) => {
      setHud(worldToHud(w))
      if (w.mythPopup) {
        setMythPopup({ statement: w.mythPopup.statement, truth: w.mythPopup.truth })
      } else {
        setMythPopup(null)
      }
      if (w.factToast) {
        setFactToast({ label: w.factToast.label, truth: w.factToast.truth })
      } else {
        setFactToast(null)
      }
    },
  }

  const initWorld = useCallback(
    (w: number, h: number) => {
      const isFinal = mode === 'final-truth'
      const world = createWorld({
        width: w,
        height: h,
        stageIndex: initialStageIndex,
        difficultyId,
        clarity: initialClarity ?? difficulty.startingClarity,
        maxClarity: difficulty.startingClarity,
        busted: initialBusted,
        avatarId,
        isFinal,
        finalParts: finalTruthParts,
      })
      if (initialStats) {
        world.score = initialStats.score ?? 0
        world.xp = initialStats.xp ?? 0
        world.gems = initialStats.gems ?? 0
        world.bestCombo = initialStats.bestCombo ?? 0
        world.badgesEarned = initialStats.badgesEarned ?? []
      }
      if (isFinal) {
        world.spawnTimer = 0.5
      }
      worldRef.current = world
      setHud(worldToHud(world))
    },
    [
      mode,
      initialStageIndex,
      difficultyId,
      initialClarity,
      difficulty.startingClarity,
      initialBusted,
      avatarId,
      finalTruthParts,
      initialStats,
    ],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!initializedRef.current) {
        initWorld(rect.width, rect.height)
        initializedRef.current = true
      } else if (worldRef.current) {
        worldRef.current.width = rect.width
        worldRef.current.height = rect.height
        worldRef.current.clouds = createClouds(rect.width, rect.height, 12)
        const p = worldRef.current.player
        const minY = rect.height * 0.32
        const maxY = rect.height - p.height - 20
        p.y = Math.min(maxY, Math.max(minY, p.y))
        p.targetY = Math.min(maxY + p.height / 2, Math.max(minY + p.height / 2, p.targetY))
      }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const localCoords = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      return { x: clientX - rect.left, y: clientY - rect.top }
    }

    const onPointerDown = (e: PointerEvent) => {
      const { x, y } = localCoords(e.clientX, e.clientY)
      const w = worldRef.current
      if (!w) return
      w.pointerDown = true
      w.player.targetX = x
      w.player.targetY = y
      dragRef.current = true
      tapStartRef.current = { x, y, t: Date.now() }
      canvas.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      const w = worldRef.current
      if (!w || !dragRef.current) return
      const { x, y } = localCoords(e.clientX, e.clientY)
      w.player.targetX = x
      w.player.targetY = y
    }

    const onPointerUp = (e: PointerEvent) => {
      const w = worldRef.current
      if (!w) return
      w.pointerDown = false
      dragRef.current = false
      const { x, y } = localCoords(e.clientX, e.clientY)
      const start = tapStartRef.current
      if (start) {
        const dx = x - start.x
        const dy = y - start.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const dt = Date.now() - start.t
        if (dist < 14 && dt < 350) {
          handleTap(w, x, y, callbacksRef.current)
        }
      }
      tapStartRef.current = null
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    const tick = (ts: number) => {
      const w = worldRef.current
      if (w && !w.ended) {
        const dt = lastTsRef.current ? Math.min((ts - lastTsRef.current) / 1000, 0.05) : 0
        lastTsRef.current = ts
        updateWorld(w, dt, callbacksRef.current)
        const lw = canvas.width / (window.devicePixelRatio || 1)
        const lh = canvas.height / (window.devicePixelRatio || 1)
        renderWorld(ctx, { ...w, width: lw, height: lh })
      } else if (w) {
        const lw = canvas.width / (window.devicePixelRatio || 1)
        const lh = canvas.height / (window.devicePixelRatio || 1)
        renderWorld(ctx, { ...w, width: lw, height: lh })
      }
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
    }
  }, [initWorld])

  return (
    <div className="arcade-gameplay">
      <ArcadeHUD hud={hud} />
      <div ref={containerRef} className="arcade-canvas-wrap">
        <AnimatedSkySvg
          variant={mode === 'final-truth' ? 'final' : avatarId}
          className="arcade-sky-svg"
        />
        <canvas ref={canvasRef} className="arcade-canvas arcade-canvas--overlay" />
        {mythPopup && (
          <MythBustPopup statement={mythPopup.statement} truth={mythPopup.truth} />
        )}
        {factToast && <FactToast label={factToast.label} truth={factToast.truth} />}
      </div>
    </div>
  )
}
