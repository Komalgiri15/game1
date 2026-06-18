import type { AvatarId } from '../types'
import { SPIRIT_IMAGES } from '../spiritAssets'
import { drawSpiritSprite } from './sprites'

const cache = new Map<AvatarId, HTMLImageElement>()
let preloadStarted = false

const ALL_SPIRIT_IDS: AvatarId[] = ['guide', 'butterfly', 'lantern', 'balloon', 'light']

/** Trim empty padding baked into the PNG exports (character is ~35% of file) */
const SPIRIT_CROPS: Record<AvatarId, { x: number; y: number; w: number; h: number }> = {
  guide: { x: 0.18, y: 0.02, w: 0.64, h: 0.94 },
  butterfly: { x: 0.08, y: 0.02, w: 0.84, h: 0.9 },
  lantern: { x: 0.14, y: 0.04, w: 0.72, h: 0.88 },
  balloon: { x: 0.12, y: 0.0, w: 0.76, h: 0.92 },
  light: { x: 0.14, y: 0.04, w: 0.72, h: 0.88 },
}

/** Base draw height in px before scale multiplier */
const SPIRIT_BASE_HEIGHT = 158

export function preloadSpiritImages(): Promise<void> {
  if (preloadStarted) {
    return Promise.all(
      ALL_SPIRIT_IDS.map((id) => {
        const img = cache.get(id)
        if (!img) return Promise.resolve()
        if (img.complete) return Promise.resolve()
        return new Promise<void>((res) => {
          img.onload = () => res()
          img.onerror = () => res()
        })
      }),
    ).then(() => undefined)
  }
  preloadStarted = true

  for (const id of ALL_SPIRIT_IDS) {
    const img = new Image()
    img.src = SPIRIT_IMAGES[id]
    cache.set(id, img)
  }

  return Promise.all(
    ALL_SPIRIT_IDS.map(
      (id) =>
        new Promise<void>((resolve) => {
          const img = cache.get(id)!
          if (img.complete) resolve()
          else {
            img.onload = () => resolve()
            img.onerror = () => resolve()
          }
        }),
    ),
  ).then(() => undefined)
}

export function getSpiritImage(form: AvatarId): HTMLImageElement | null {
  const img = cache.get(form)
  if (img?.complete && img.naturalWidth > 0) return img
  return null
}

/** Screen blend on light sky; cropped + scaled so characters read large in-game */
export function drawSpiritImage(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  form: AvatarId,
  stageColor: string,
  scale = 1,
  bob = 0,
) {
  const img = getSpiritImage(form)
  if (!img) {
    drawSpiritSprite(ctx, cx, cy, form, stageColor, scale * 1.35, bob)
    return
  }

  const crop = SPIRIT_CROPS[form] ?? SPIRIT_CROPS.guide
  const iw = img.naturalWidth
  const ih = img.naturalHeight
  const sx = crop.x * iw
  const sy = crop.y * ih
  const sw = crop.w * iw
  const sh = crop.h * ih

  const destH = SPIRIT_BASE_HEIGHT * scale
  const destW = destH * (sw / sh)
  const y = cy + bob

  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.drawImage(img, sx, sy, sw, sh, cx - destW / 2, y - destH / 2, destW, destH)
  ctx.restore()
}
