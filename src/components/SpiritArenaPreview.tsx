import { useEffect, useMemo, useRef } from 'react'
import type { AvatarId } from '../game/types'
import { MYTH_BUBBLE_PALETTE } from '../game/constants'
import {
  createClouds,
  drawCloudLayer,
  drawMiniFactOrb,
  drawMiniMythCloud,
  type Cloud,
} from '../game/arcade/clouds'
import { drawSpiritImage, preloadSpiritImages } from '../game/arcade/spriteImages'
import { getSpiritCloudTheme } from '../game/spiritAssets'
import { usesPremiumSky } from './premiumSky/themes'
import { AnimatedSkySvg } from './AnimatedSkySvg'

interface SpiritArenaPreviewProps {
  avatarId: AvatarId
  tall?: boolean
  showLegends?: boolean
}

const PREVIEW_H = { normal: 200, tall: 240 } as const

export function SpiritArenaPreview({
  avatarId,
  tall = false,
  showLegends = false,
}: SpiritArenaPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cloudsRef = useRef<Cloud[]>([])
  const animRef = useRef(0)
  const height = tall ? PREVIEW_H.tall : PREVIEW_H.normal

  const bubblePalette = useMemo(
    () => MYTH_BUBBLE_PALETTE[Math.floor(Math.random() * MYTH_BUBBLE_PALETTE.length)],
    [avatarId],
  )

  useEffect(() => {
    preloadSpiritImages()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const container = canvas.parentElement
    if (!container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const w = container.clientWidth
      const h = height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cloudsRef.current = createClouds(w, h, 9)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    let t0 = 0
    const tick = (ts: number) => {
      if (!t0) t0 = ts
      const t = (ts - t0) / 1000
      const w = container.clientWidth
      const h = height
      const theme = getSpiritCloudTheme(avatarId, false)
      const { color, dim } = bubblePalette

      ctx.clearRect(0, 0, w, h)
      if (!usesPremiumSky(avatarId, false)) {
        const cloudT = t * theme.cloudSpeed
        drawCloudLayer(ctx, w, h, cloudsRef.current, cloudT, theme.cloudTint)
        drawCloudLayer(ctx, w, h, cloudsRef.current, cloudT * 0.6 + 3, theme.cloudTint2)
      } else {
        drawCloudLayer(ctx, w, h, cloudsRef.current, t * 0.35, 'rgba(255, 255, 255, 0.1)')
      }

      const mythX = w * 0.72 + Math.sin(t * 0.7) * 28
      const mythY = 58 + Math.cos(t * 0.5) * 8
      drawMiniMythCloud(ctx, mythX, mythY, 36, 'Myth floats by…', color, dim)

      const factX = w * 0.22 + Math.cos(t * 0.55) * 22
      const factY = 88 + Math.sin(t * 0.45) * 10
      drawMiniFactOrb(ctx, factX, factY, 22, 'Fact', t)

      const spiritX = w * 0.5 + Math.sin(t * 1.4) * (w * 0.26)
      const spiritY = h - 62
      const bob = Math.sin(t * 5) * 5
      drawSpiritImage(ctx, spiritX, spiritY, avatarId, color, 1.25, bob)

      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [avatarId, bubblePalette, height])

  return (
    <div
      className={`spirit-arena-wrap ${tall ? 'spirit-arena-wrap--tall' : ''}`}
      style={{ minHeight: height }}
    >
      <AnimatedSkySvg variant={avatarId} className="spirit-arena-sky" />
      <canvas ref={canvasRef} className="spirit-arena-canvas spirit-arena-canvas--overlay" />

      {showLegends && (
        <div className="spirit-arena-legends" aria-hidden>
          <span className="spirit-arena-legend spirit-arena-legend--myth">Tap myths</span>
          <span className="spirit-arena-legend spirit-arena-legend--fact">Collect orbs</span>
          <span className="spirit-arena-legend spirit-arena-legend--spirit">Drag to move</span>
        </div>
      )}

      <p className="spirit-arena-caption label-caps">
        Live preview — sky &amp; spirit match your type
      </p>
    </div>
  )
}
