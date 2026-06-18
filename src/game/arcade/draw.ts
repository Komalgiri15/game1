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

function mythDrawPos(myth: MythBubble) {
  return {
    x: myth.x + Math.sin(myth.wobblePhase) * 5,
    y: myth.y + Math.cos(myth.wobblePhase * 0.7) * 3,
  }
}

export function drawMythBubble(
  ctx: CanvasRenderingContext2D,
  myth: MythBubble,
  color: string,
  dim: string,
  isFinal: boolean,
) {
  const { x, y } = mythDrawPos(myth)
  const r = myth.radius * (myth.dying ? 1 + (0.4 - myth.dieTimer) * 0.5 : 1)
  const alpha = myth.dying ? myth.dieTimer / 0.4 : 1
  const isBoss = isFinal || !!myth.isBoss

  ctx.globalAlpha = alpha

  // Soft outer glow
  ctx.shadowColor = isBoss ? 'rgba(214, 168, 92, 0.7)' : 'rgba(181, 87, 122, 0.45)'
  ctx.shadowBlur = isBoss ? 32 : 22

  // Main bubble — bright, readable
  const g = ctx.createRadialGradient(x, y - r * 0.15, r * 0.05, x, y, r)
  g.addColorStop(0, 'rgba(255, 255, 255, 0.98)')
  g.addColorStop(0.45, 'rgba(255, 251, 247, 0.95)')
  g.addColorStop(0.75, dim)
  g.addColorStop(1, isBoss ? 'rgba(255, 222, 173, 0.55)' : 'rgba(255, 185, 205, 0.5)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()

  // Inner highlight ring
  ctx.strokeStyle = isBoss ? '#d6a85c' : color
  ctx.lineWidth = isBoss ? 3.5 : 3
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(x, y, r * 0.88, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  ctx.shadowBlur = 0

  // Myth label tag
  const tag = isBoss ? 'MYTH' : 'TAP TO BUST'
  ctx.font = `700 ${isBoss ? 11 : 10}px "Plus Jakarta Sans", sans-serif`
  ctx.textAlign = 'center'
  ctx.fillStyle = isBoss ? '#8a6a2e' : color
  ctx.fillText(tag, x, y - r + (isBoss ? 20 : 18))

  const fontSize = isBoss ? 17 : 15
  ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", sans-serif`
  const lines = wrapText(ctx, myth.statement, r * 1.5)
  const lineH = fontSize + 5
  const startY = y - ((lines.length - 1) * lineH) / 2 + 4

  for (let i = 0; i < lines.length; i++) {
    const ly = startY + i * lineH
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
    ctx.lineWidth = 3
    ctx.lineJoin = 'round'
    ctx.strokeText(lines[i], x, ly)
    ctx.fillStyle = '#2d2520'
    ctx.fillText(lines[i], x, ly)
  }

  ctx.textAlign = 'left'
  ctx.globalAlpha = 1
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
    drawMythBubble(
      ctx,
      m,
      world.stageColor,
      world.stageColorDim,
      isGold || !!m.isBoss,
    )
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
