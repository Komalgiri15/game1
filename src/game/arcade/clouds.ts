/** Procedural soft clouds — shared by gameplay + spirit picker */

export interface Cloud {
  x: number
  y: number
  scale: number
  speed: number
  opacity: number
  seed: number
}

export function createClouds(width: number, height: number, count = 10): Cloud[] {
  const clouds: Cloud[] = []
  for (let i = 0; i < count; i++) {
    clouds.push({
      x: (width / count) * i + Math.random() * 80,
      y: height * (0.08 + Math.random() * 0.55),
      scale: 0.55 + Math.random() * 0.9,
      speed: 8 + Math.random() * 18,
      opacity: 0.35 + Math.random() * 0.35,
      seed: i * 1.7,
    })
  }
  return clouds
}

export function drawCloudPuff(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  fill: string,
) {
  const s = scale
  const puffs = [
    { dx: 0, dy: 0, rx: 28, ry: 18 },
    { dx: -22 * s, dy: 4, rx: 22, ry: 14 },
    { dx: 22 * s, dy: 3, rx: 24, ry: 15 },
    { dx: -10 * s, dy: -10, rx: 18, ry: 12 },
    { dx: 14 * s, dy: -8, rx: 20, ry: 13 },
  ]
  ctx.fillStyle = fill
  for (const p of puffs) {
    ctx.beginPath()
    ctx.ellipse(cx + p.dx * s, cy + p.dy * s, p.rx * s, p.ry * s, 0, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function drawCloudLayer(
  ctx: CanvasRenderingContext2D,
  width: number,
  _height: number,
  clouds: Cloud[],
  time: number,
  tint = '#ffffff',
) {
  for (const c of clouds) {
    const drift = ((time * c.speed + c.seed * 40) % (width + 200)) - 100
    const x = (c.x + drift) % (width + 160) - 80
    const bob = Math.sin(time * 0.4 + c.seed) * 6
    ctx.globalAlpha = c.opacity
    drawCloudPuff(ctx, x, c.y + bob, c.scale, tint)
  }
  ctx.globalAlpha = 1
}

export function drawSkyGradient(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  top: string,
  mid: string,
  bottom: string,
) {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, top)
  g.addColorStop(0.5, mid)
  g.addColorStop(1, bottom)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
}

/** Mini myth cloud for previews — soft bubble, no outline */
function hexAlpha(hex: string, alpha: number): string {
  const n = hex.replace('#', '')
  const r = parseInt(n.slice(0, 2), 16)
  const g = parseInt(n.slice(2, 4), 16)
  const b = parseInt(n.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function drawMiniMythCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  label: string,
  color: string,
  dim: string,
) {
  const halo = ctx.createRadialGradient(x, y, r * 0.35, x, y, r * 1.2)
  halo.addColorStop(0, hexAlpha(dim, 0.35))
  halo.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = halo
  ctx.beginPath()
  ctx.arc(x, y, r * 1.2, 0, Math.PI * 2)
  ctx.fill()

  const g = ctx.createRadialGradient(x - r * 0.25, y - r * 0.28, 2, x, y, r)
  g.addColorStop(0, 'rgba(255, 255, 255, 0.75)')
  g.addColorStop(0.5, hexAlpha(dim, 0.45))
  g.addColorStop(1, hexAlpha(color, 0.28))
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()

  ctx.font = '700 8px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.fillText('MYTH', x, y - r + 14)
  ctx.font = '600 10px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = color
  ctx.globalAlpha = 0.9
  ctx.fillText(label, x, y + 4)
  ctx.globalAlpha = 1
  ctx.textAlign = 'left'
}

/** Mini fact orb for previews */
export function drawMiniFactOrb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  label: string,
  phase: number,
) {
  const pulse = 1 + Math.sin(phase * 3) * 0.05
  const pr = r * pulse
  const g = ctx.createRadialGradient(x, y, 0, x, y, pr)
  g.addColorStop(0, '#e8f5e8')
  g.addColorStop(1, 'rgba(126, 158, 126, 0.25)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, pr, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#7e9e7e'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.font = '600 9px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#4a5f4a'
  ctx.textAlign = 'center'
  ctx.fillText(label, x, y + 3)
  ctx.textAlign = 'left'
}
