import { circleHit, clamp, wrapText } from './physics'
import type { ArcadeWorld, MythBubble, Particle, Player } from './types'
import { effectiveAvatar } from './types'
import { drawCloudLayer } from './clouds'
import { usesPremiumSky } from '../../components/premiumSky/themes'
import { getSpiritCloudTheme } from '../spiritAssets'
import { drawSpiritImage } from './spriteImages'

/** Transparent canvas — AnimatedSkySvg / PremiumGuideSky sits behind in the DOM */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  world: ArcadeWorld,
) {
  ctx.clearRect(0, 0, w, h)

  // Premium DOM SVG skies — light canvas mist only
  if (usesPremiumSky(world.avatarId, world.isFinal)) {
    const time = Date.now() / 1000
    drawCloudLayer(ctx, w, h, world.clouds, time * 0.35, 'rgba(255, 255, 255, 0.1)')
    return
  }

  const theme = getSpiritCloudTheme(world.avatarId, world.isFinal)
  const time = (Date.now() / 1000) * theme.cloudSpeed
  drawCloudLayer(ctx, w, h, world.clouds, time, theme.cloudTint)
  drawCloudLayer(ctx, w, h, world.clouds, time * 0.55 + 2, theme.cloudTint2)
}

export function drawFactOrb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  label: string,
  phase: number,
) {
  const pulse = 1 + Math.sin(phase * 3) * 0.06
  const pr = r * pulse
  ctx.shadowColor = 'rgba(126, 158, 126, 0.5)'
  ctx.shadowBlur = 16
  const g = ctx.createRadialGradient(x, y, 0, x, y, pr)
  g.addColorStop(0, '#e8f5e8')
  g.addColorStop(0.7, 'rgba(126, 158, 126, 0.35)')
  g.addColorStop(1, 'rgba(126, 158, 126, 0.1)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, pr, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#7e9e7e'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.shadowBlur = 0
  ctx.fillStyle = '#4a5f4a'
  ctx.font = '600 14px "Plus Jakarta Sans", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(label, x, y + 4)
  ctx.textAlign = 'left'
}

function hexAlpha(hex: string, alpha: number): string {
  const n = hex.replace('#', '')
  const r = parseInt(n.slice(0, 2), 16)
  const g = parseInt(n.slice(2, 4), 16)
  const b = parseInt(n.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function mythDrawPos(myth: MythBubble) {
  const drift = Math.sin(myth.wobblePhase) * 4
  const bob = Math.cos(myth.wobblePhase * 0.55) * 2.5
  return {
    x: myth.x + drift,
    y: myth.y + bob,
  }
}

function emergeEase(myth: MythBubble): number {
  if (myth.isBoss) return 1
  const t = Math.min(1, myth.spawnAge / myth.spawnDuration)
  return 1 - Math.pow(1 - t, 3)
}

function fitMythText(
  ctx: CanvasRenderingContext2D,
  statement: string,
  maxWidth: number,
  maxHeight: number,
  isBoss: boolean,
): { lines: string[]; fontSize: number; lineH: number } {
  const base = isBoss ? 16 : 14
  const min = isBoss ? 13 : 11
  for (let size = base; size >= min; size--) {
    ctx.font = `600 ${size}px "Plus Jakarta Sans", sans-serif`
    const lines = wrapText(ctx, statement, maxWidth, 5)
    const lineH = size + 3
    if (lines.length * lineH <= maxHeight) {
      return { lines, fontSize: size, lineH }
    }
  }
  ctx.font = `600 ${min}px "Plus Jakarta Sans", sans-serif`
  const lines = wrapText(ctx, statement, maxWidth, 4)
  return { lines, fontSize: min, lineH: min + 3 }
}

export function drawMythBubble(
  ctx: CanvasRenderingContext2D,
  myth: MythBubble,
  isFinal: boolean,
) {
  const { x, y } = mythDrawPos(myth)
  const isBoss = isFinal || !!myth.isBoss
  const color = myth.bubbleColor
  const dim = myth.bubbleColorDim
  const haloTint = myth.bubbleHalo
  const emerge = emergeEase(myth)
  const baseR = myth.radius * (0.35 + emerge * 0.65)
  const r = baseR * (myth.dying ? 1 + (0.4 - myth.dieTimer) * 0.35 : 1)
  const alpha = (myth.dying ? myth.dieTimer / 0.4 : 1) * (isBoss ? 1 : 0.35 + emerge * 0.65)

  ctx.save()
  ctx.globalAlpha = alpha

  // Soft outer halo
  const halo = ctx.createRadialGradient(x, y, r * 0.4, x, y, r * 1.35)
  halo.addColorStop(0, haloTint)
  halo.addColorStop(0.55, hexAlpha(color, 0.08))
  halo.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = halo
  ctx.beginPath()
  ctx.arc(x, y, r * 1.35, 0, Math.PI * 2)
  ctx.fill()

  // Translucent soap-bubble body
  const body = ctx.createRadialGradient(x - r * 0.28, y - r * 0.32, r * 0.05, x, y, r)
  body.addColorStop(0, 'rgba(255, 255, 255, 0.72)')
  body.addColorStop(0.35, 'rgba(255, 252, 250, 0.42)')
  body.addColorStop(0.7, isBoss ? 'rgba(255, 222, 173, 0.22)' : hexAlpha(dim, 0.35))
  body.addColorStop(1, isBoss ? 'rgba(214, 168, 92, 0.28)' : hexAlpha(color, 0.28))
  ctx.fillStyle = body
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()

  // Specular highlight (top-left crescent)
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, r * 0.92, 0, Math.PI * 2)
  ctx.clip()
  const spec = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, 0, x - r * 0.2, y - r * 0.25, r * 0.55)
  spec.addColorStop(0, 'rgba(255, 255, 255, 0.85)')
  spec.addColorStop(0.45, 'rgba(255, 255, 255, 0.25)')
  spec.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = spec
  ctx.fillRect(x - r, y - r, r * 2, r * 2)

  // Tiny secondary gleam
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.beginPath()
  ctx.ellipse(x + r * 0.22, y + r * 0.18, r * 0.07, r * 0.05, -0.4, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  if (emerge > 0.5) {
    const textAlpha = Math.min(1, (emerge - 0.5) / 0.5)
    ctx.globalAlpha = alpha * textAlpha

    const tag = isBoss ? 'MYTH' : 'TAP TO BUST'
    const tagSize = isBoss ? 10 : 9
    ctx.font = `700 ${tagSize}px "Plus Jakarta Sans", sans-serif`
    ctx.textAlign = 'center'
    ctx.fillStyle = isBoss ? 'rgba(138, 106, 46, 0.8)' : hexAlpha(color, 0.85)
    ctx.fillText(tag, x, y - r + (isBoss ? 18 : 16))

    const textAreaH = r * 1.55
    const { lines, fontSize, lineH } = fitMythText(
      ctx,
      myth.statement,
      r * 1.62,
      textAreaH,
      isBoss,
    )
    ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", sans-serif`
    const startY = y - ((lines.length - 1) * lineH) / 2 + 2

    for (let i = 0; i < lines.length; i++) {
      const ly = startY + i * lineH
      ctx.fillStyle = isBoss ? 'rgba(106, 82, 38, 0.9)' : hexAlpha(color, 0.92)
      ctx.fillText(lines[i], x, ly)
    }
  }

  ctx.textAlign = 'left'
  ctx.restore()
}

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  world: ArcadeWorld,
) {
  const form = effectiveAvatar(world.avatarId, world.stageIndex, world.isFinal)
  const px = player.x + player.width / 2
  const bob = Math.sin(player.bobPhase) * 5
  const py = player.y + player.height / 2

  // Shadow on ground
  ctx.fillStyle = 'rgba(74, 64, 54, 0.12)'
  ctx.beginPath()
  ctx.ellipse(px, world.height - 18, player.width * 0.55, 8, 0, 0, Math.PI * 2)
  ctx.fill()

  drawSpiritImage(ctx, px, py, form, world.stageColor, 1.35, bob)
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.globalAlpha = p.life / p.maxLife
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

export function drawFloatTexts(ctx: CanvasRenderingContext2D, world: ArcadeWorld) {
  for (const ft of world.floatTexts) {
    ctx.globalAlpha = clamp(ft.life / 0.8, 0, 1)
    ctx.fillStyle = ft.color
    ctx.font = '700 20px "Plus Jakarta Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(ft.text, ft.x, ft.y)
  }
  ctx.textAlign = 'left'
  ctx.globalAlpha = 1
}

export function drawWorld(ctx: CanvasRenderingContext2D, world: ArcadeWorld) {
  const { width: w, height: h } = world
  drawBackground(ctx, w, h, world)

  for (const f of world.facts) {
    drawFactOrb(ctx, f.x, f.y, f.radius, f.label, f.wobblePhase)
  }

  const isGold = world.isFinal
  for (const m of world.myths) {
    drawMythBubble(ctx, m, isGold || !!m.isBoss)
  }

  drawParticles(ctx, world.particles)
  drawPlayer(ctx, world.player, world)
  drawFloatTexts(ctx, world)
}

export function spawnBurst(
  world: ArcadeWorld,
  x: number,
  y: number,
  color: string,
  count = 12,
) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
    const speed = 60 + Math.random() * 100
    world.particles.push({
      id: world.particles.length + 1,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.5 + Math.random() * 0.3,
      maxLife: 0.8,
      color,
      size: 2 + Math.random() * 4,
    })
  }
}

export { circleHit, mythDrawPos }
