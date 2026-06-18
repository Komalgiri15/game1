import { useEffect, useRef } from 'react'
import type { AvatarId } from '../game/types'
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
}

export function SpiritArenaPreview({ avatarId }: SpiritArenaPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cloudsRef = useRef<Cloud[]>([])
  const animRef = useRef(0)

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
      const h = 200
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
      const h = 200
      const theme = getSpiritCloudTheme(avatarId, false)
      const color = '#b5577a'

      ctx.clearRect(0, 0, w, h)
      if (!usesPremiumSky(avatarId, false)) {
        const cloudT = t * theme.cloudSpeed
        drawCloudLayer(ctx, w, h, cloudsRef.current, cloudT, theme.cloudTint)
        drawCloudLayer(ctx, w, h, cloudsRef.current, cloudT * 0.6 + 3, theme.cloudTint2)
      } else {
        drawCloudLayer(ctx, w, h, cloudsRef.current, t * 0.35, 'rgba(255, 255, 255, 0.1)')
      }

      const mythX = w * 0.72 + Math.sin(t * 0.7) * 30
      const mythY = 52 + Math.cos(t * 0.5) * 8
      drawMiniMythCloud(ctx, mythX, mythY, 38, 'Myth floats by…', color, '#ffd9e3')

      const factX = w * 0.22 + Math.cos(t * 0.55) * 24
      const factY = 78 + Math.sin(t * 0.45) * 10
      drawMiniFactOrb(ctx, factX, factY, 22, 'Fact', t)

      const spiritX = w * 0.5 + Math.sin(t * 1.4) * (w * 0.28)
      const spiritY = h - 58
      const bob = Math.sin(t * 5) * 5
      drawSpiritImage(ctx, spiritX, spiritY, avatarId, color, 1.25, bob)

      ctx.font = '600 9px "Plus Jakarta Sans", sans-serif'
      ctx.fillStyle = 'rgba(74, 64, 54, 0.5)'
      ctx.textAlign = 'center'
      ctx.fillText('tap myths', mythX, mythY + 52)
      ctx.fillText('collect facts', factX, factY + 34)
      ctx.fillText('your type moves', spiritX, h - 12)
      ctx.textAlign = 'left'

      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [avatarId])

  return (
    <div className="spirit-arena-wrap">
      <AnimatedSkySvg variant={avatarId} className="spirit-arena-sky" />
      <canvas ref={canvasRef} className="spirit-arena-canvas spirit-arena-canvas--overlay" />
      <p className="spirit-arena-caption label-caps">
        Live preview — sky moves with your type
      </p>
    </div>
  )
}
