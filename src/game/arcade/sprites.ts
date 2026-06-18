import type { AvatarId } from '../types'

const FORM_GLYPH: Record<AvatarId, string> = {
  guide: '✧',
  butterfly: '🦋',
  lantern: '◈',
  balloon: '◎',
  light: '☀',
}

/** Small icon for spirit picker chips — not the old peg silhouettes */
export function spiritGlyph(id: AvatarId): string {
  return FORM_GLYPH[id]
}

/**
 * Object-first playable sprites — butterfly, lantern, balloon, light beam.
 * No peg silhouettes; each form IS the thing you control.
 */
export function drawSpiritSprite(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  form: AvatarId,
  stageColor: string,
  scale = 1,
  bob = 0,
) {
  const s = scale
  const y = cy + bob

  switch (form) {
    case 'butterfly':
      drawButterfly(ctx, cx, y, s, stageColor)
      break
    case 'lantern':
      drawLantern(ctx, cx, y, s)
      break
    case 'balloon':
      drawBalloon(ctx, cx, y, s, stageColor)
      break
    case 'light':
      drawLightBeam(ctx, cx, y, s)
      break
    default:
      drawGuideSpirit(ctx, cx, y, s, stageColor)
  }
}

function drawButterfly(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  color: string,
) {
  const flap = Math.sin(Date.now() * 0.012) * 0.35 + 0.65
  const wingW = 26 * s * flap
  const wingH = 18 * s

  // Trail sparkles
  ctx.globalAlpha = 0.35
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = '#d1c0fe'
    ctx.beginPath()
    ctx.arc(cx - 20 * s - i * 8, cy + i * 3, 2.5 * s, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // Wings — upper
  ctx.fillStyle = '#e8ddff'
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5 * s
  ctx.beginPath()
  ctx.ellipse(cx - wingW, cy - 6 * s, wingW, wingH, -0.25, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(cx + wingW, cy - 6 * s, wingW, wingH, 0.25, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // Wings — lower
  ctx.fillStyle = '#d1c0fe'
  ctx.beginPath()
  ctx.ellipse(cx - wingW * 0.75, cy + 8 * s, wingW * 0.7, wingH * 0.65, -0.15, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(cx + wingW * 0.75, cy + 8 * s, wingW * 0.7, wingH * 0.65, 0.15, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // Body
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.ellipse(cx, cy, 4 * s, 14 * s, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#fff8f4'
  ctx.beginPath()
  ctx.arc(cx, cy - 10 * s, 3 * s, 0, Math.PI * 2)
  ctx.fill()
}

function drawLantern(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  // Glow pool
  const glow = ctx.createRadialGradient(cx, cy + 8 * s, 0, cx, cy + 8 * s, 50 * s)
  glow.addColorStop(0, 'rgba(255, 222, 173, 0.55)')
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(cx, cy + 8 * s, 50 * s, 0, Math.PI * 2)
  ctx.fill()

  // String
  ctx.strokeStyle = '#8a6a2e'
  ctx.lineWidth = 1.5 * s
  ctx.beginPath()
  ctx.moveTo(cx, cy - 38 * s)
  ctx.lineTo(cx, cy - 48 * s)
  ctx.stroke()

  // Top cap
  ctx.fillStyle = '#8a6a2e'
  ctx.beginPath()
  ctx.roundRect(cx - 10 * s, cy - 40 * s, 20 * s, 6 * s, 2 * s)
  ctx.fill()

  // Lantern body
  ctx.shadowColor = 'rgba(214, 168, 92, 0.9)'
  ctx.shadowBlur = 18 * s
  const body = ctx.createLinearGradient(cx, cy - 34 * s, cx, cy + 14 * s)
  body.addColorStop(0, '#ffdead')
  body.addColorStop(0.5, '#d6a85c')
  body.addColorStop(1, '#b8860b')
  ctx.fillStyle = body
  ctx.beginPath()
  ctx.roundRect(cx - 16 * s, cy - 34 * s, 32 * s, 44 * s, 6 * s)
  ctx.fill()
  ctx.shadowBlur = 0

  // Inner light
  ctx.fillStyle = 'rgba(255, 251, 247, 0.9)'
  ctx.fillRect(cx - 10 * s, cy - 26 * s, 20 * s, 28 * s)

  // Bottom cap
  ctx.fillStyle = '#8a6a2e'
  ctx.beginPath()
  ctx.roundRect(cx - 8 * s, cy + 12 * s, 16 * s, 5 * s, 2 * s)
  ctx.fill()

  // Light rays
  ctx.globalAlpha = 0.25
  ctx.strokeStyle = '#ffdead'
  ctx.lineWidth = 2 * s
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * 2 * i) / 6 + Date.now() * 0.001
    ctx.beginPath()
    ctx.moveTo(cx, cy - 8 * s)
    ctx.lineTo(cx + Math.cos(a) * 36 * s, cy - 8 * s + Math.sin(a) * 36 * s)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function drawBalloon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  color: string,
) {
  // Balloon envelope
  const bg = ctx.createRadialGradient(cx - 8 * s, cy - 28 * s, 4, cx, cy - 22 * s, 30 * s)
  bg.addColorStop(0, '#e8ddff')
  bg.addColorStop(0.6, color)
  bg.addColorStop(1, '#973f61')
  ctx.fillStyle = bg
  ctx.beginPath()
  ctx.ellipse(cx, cy - 24 * s, 26 * s, 32 * s, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#973f61'
  ctx.lineWidth = 2 * s
  ctx.stroke()

  // Highlight
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.beginPath()
  ctx.ellipse(cx - 10 * s, cy - 34 * s, 8 * s, 12 * s, -0.3, 0, Math.PI * 2)
  ctx.fill()

  // Ropes
  ctx.strokeStyle = '#4a4036'
  ctx.lineWidth = 1.2 * s
  ctx.beginPath()
  ctx.moveTo(cx - 8 * s, cy + 6 * s)
  ctx.lineTo(cx - 10 * s, cy + 22 * s)
  ctx.moveTo(cx + 8 * s, cy + 6 * s)
  ctx.lineTo(cx + 10 * s, cy + 22 * s)
  ctx.moveTo(cx, cy + 8 * s)
  ctx.lineTo(cx, cy + 24 * s)
  ctx.stroke()

  // Basket
  ctx.fillStyle = '#c4a882'
  ctx.beginPath()
  ctx.moveTo(cx - 14 * s, cy + 24 * s)
  ctx.lineTo(cx + 14 * s, cy + 24 * s)
  ctx.lineTo(cx + 11 * s, cy + 36 * s)
  ctx.lineTo(cx - 11 * s, cy + 36 * s)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#8a7355'
  ctx.stroke()

  // Tiny rider glow
  ctx.fillStyle = '#fff8f4'
  ctx.beginPath()
  ctx.arc(cx, cy + 28 * s, 4 * s, 0, Math.PI * 2)
  ctx.fill()
}

function drawLightBeam(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const rot = Date.now() * 0.0008

  // Outer aura
  const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, 52 * s)
  aura.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
  aura.addColorStop(0.35, 'rgba(255, 222, 173, 0.7)')
  aura.addColorStop(0.7, 'rgba(214, 168, 92, 0.25)')
  aura.addColorStop(1, 'transparent')
  ctx.fillStyle = aura
  ctx.beginPath()
  ctx.arc(cx, cy, 52 * s, 0, Math.PI * 2)
  ctx.fill()

  // Rotating rays
  ctx.globalAlpha = 0.45
  ctx.strokeStyle = '#ffdead'
  ctx.lineWidth = 3 * s
  for (let i = 0; i < 8; i++) {
    const a = rot + (Math.PI * 2 * i) / 8
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(a) * 44 * s, cy + Math.sin(a) * 44 * s)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  // Core
  ctx.fillStyle = '#fffbf7'
  ctx.shadowColor = 'rgba(214, 168, 92, 0.9)'
  ctx.shadowBlur = 20 * s
  ctx.beginPath()
  ctx.arc(cx, cy, 14 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.fillStyle = '#d6a85c'
  ctx.beginPath()
  ctx.arc(cx, cy, 8 * s, 0, Math.PI * 2)
  ctx.fill()
}

function drawGuideSpirit(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  color: string,
) {
  // Floating luminous companion — soft aura, not a peg
  const pulse = 1 + Math.sin(Date.now() * 0.004) * 0.06
  const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40 * s * pulse)
  aura.addColorStop(0, `${color}55`)
  aura.addColorStop(0.5, `${color}22`)
  aura.addColorStop(1, 'transparent')
  ctx.fillStyle = aura
  ctx.beginPath()
  ctx.arc(cx, cy, 40 * s * pulse, 0, Math.PI * 2)
  ctx.fill()

  // Flowing dress shape
  ctx.fillStyle = color
  ctx.globalAlpha = 0.85
  ctx.beginPath()
  ctx.moveTo(cx, cy - 22 * s)
  ctx.bezierCurveTo(cx + 18 * s, cy - 10 * s, cx + 16 * s, cy + 22 * s, cx, cy + 28 * s)
  ctx.bezierCurveTo(cx - 16 * s, cy + 22 * s, cx - 18 * s, cy - 10 * s, cx, cy - 22 * s)
  ctx.fill()
  ctx.globalAlpha = 1

  // Head glow
  ctx.fillStyle = '#fff8f4'
  ctx.shadowColor = `${color}aa`
  ctx.shadowBlur = 12 * s
  ctx.beginPath()
  ctx.arc(cx, cy - 20 * s, 9 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  // Hair wisps
  ctx.strokeStyle = color
  ctx.lineWidth = 2 * s
  ctx.globalAlpha = 0.6
  ctx.beginPath()
  ctx.moveTo(cx - 6 * s, cy - 26 * s)
  ctx.quadraticCurveTo(cx - 14 * s, cy - 18 * s, cx - 10 * s, cy - 8 * s)
  ctx.moveTo(cx + 6 * s, cy - 26 * s)
  ctx.quadraticCurveTo(cx + 14 * s, cy - 18 * s, cx + 10 * s, cy - 8 * s)
  ctx.stroke()
  ctx.globalAlpha = 1
}
