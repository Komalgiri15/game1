import { useId } from 'react'
import type { SkyVariant } from './types'
import {
  DISTANT_CLOUDS,
  FORE_CLOUDS,
  MID_CLOUDS,
  WISPY_CLOUDS,
  type PlacedCloud,
} from './cloudPaths'
import { PREMIUM_SKY_THEMES, resolvePremiumVariant } from './themes'

interface PremiumSpiritSkyProps {
  variant: SkyVariant
  className?: string
}

export function PremiumSpiritSky({ variant, className = '' }: PremiumSpiritSkyProps) {
  const id = useId().replace(/:/g, '')
  const key = resolvePremiumVariant(variant)
  const t = PREMIUM_SKY_THEMES[key]

  return (
    <svg
      className={`premium-spirit-sky animated-sky ${className}`}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={`sky-${id}`} x1="960" y1="0" x2="960" y2="1080">
          <stop offset="0%" stopColor={t.skyStops[0]} />
          <stop offset="35%" stopColor={t.skyStops[1]} />
          <stop offset="70%" stopColor={t.skyStops[2]} />
          <stop offset="100%" stopColor={t.skyStops[3]} />
        </linearGradient>

        <radialGradient id={`glow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={t.glowStops[0]} stopOpacity="0.92" />
          <stop offset="50%" stopColor={t.glowStops[1]} stopOpacity="0.35" />
          <stop offset="100%" stopColor={t.glowStops[2]} stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`cloudNear-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.cloudNearTop} stopOpacity="0.92" />
          <stop offset="100%" stopColor={t.cloudNearBottom} stopOpacity="0.68" />
        </linearGradient>

        <linearGradient id={`cloudFar-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.cloudFarTop} stopOpacity="0.95" />
          <stop offset="100%" stopColor={t.cloudFarBottom} stopOpacity="0.72" />
        </linearGradient>

        <filter id={`blur-${id}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>

        <filter id={`sparkle-${id}`}>
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      <rect width="1920" height="1080" fill={`url(#sky-${id})`} />

      <TypeAccent variant={key} id={id} theme={t} />

      <g className="premium-sky__glow">
        <ellipse
          cx={t.glowCx}
          cy={t.glowCy}
          rx={t.glowRx}
          ry={t.glowRy}
          fill={`url(#glow-${id})`}
        />
      </g>

      <g className="premium-sky__wispy" opacity="0.35">
        {WISPY_CLOUDS.map((c, i) => (
          <CloudShape
            key={`w-${i}`}
            cloud={c}
            fill={t.distantFillAlt}
            id={id}
            useNear={false}
          />
        ))}
      </g>

      <g className="premium-sky__distant" opacity="0.5" filter={`url(#blur-${id})`}>
        {DISTANT_CLOUDS.map((c, i) => (
          <CloudShape
            key={`d-${i}`}
            cloud={c}
            fill={i % 2 === 0 ? t.distantFill : t.distantFillAlt}
            id={id}
            useNear={false}
          />
        ))}
      </g>

      <g className="premium-sky__mid" opacity="0.78">
        {MID_CLOUDS.map((c, i) => (
          <CloudShape key={`m-${i}`} cloud={c} fill={`url(#cloudFar-${id})`} id={id} useNear={false} />
        ))}
      </g>

      <g className="premium-sky__foreground" opacity="0.94">
        {FORE_CLOUDS.map((c, i) => (
          <CloudShape key={`f-${i}`} cloud={c} fill={`url(#cloudNear-${id})`} id={id} useNear />
        ))}
      </g>

      <g className="premium-sky__sparkles" opacity="0.8" filter={`url(#sparkle-${id})`}>
        {SPARKLES.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={t.sparkle}
            className="premium-sky__sparkle"
            style={{ animationDelay: `${s.d}s` }}
          />
        ))}
      </g>

      <g className="premium-sky__dust" opacity="0.55">
        {DUST.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={i % 2 === 0 ? t.dust : t.dustAlt}
            className="premium-sky__dust-mote"
            style={{ animationDelay: `${d.d}s` }}
          />
        ))}
      </g>

      <ellipse cx="0" cy="540" rx="240" ry="100" fill={t.edgeCloud} opacity="0.55" />
      <ellipse cx="1920" cy="540" rx="240" ry="100" fill={t.edgeCloud} opacity="0.55" />
    </svg>
  )
}

function CloudShape({
  cloud,
  fill,
}: {
  cloud: PlacedCloud
  fill: string
  id: string
  useNear: boolean
}) {
  const sx = cloud.flip ? -cloud.scale : cloud.scale
  return (
    <g transform={`translate(${cloud.x} ${cloud.y}) scale(${sx} ${cloud.scale})`}>
      <path d={cloud.path} fill={fill} />
    </g>
  )
}

function TypeAccent({
  variant,
}: {
  variant: ReturnType<typeof resolvePremiumVariant>
  id: string
  theme: (typeof PREMIUM_SKY_THEMES)['guide']
}) {
  if (variant === 'butterfly') {
    return (
      <g className="premium-sky__accent" opacity="0.12">
        <path
          d="M320 200 C380 120 480 100 520 180 C480 220 400 240 320 200 Z"
          fill="#D1C0FE"
          className="premium-sky__accent-float"
        />
        <path
          d="M1600 240 C1540 160 1440 140 1400 220 C1440 260 1520 280 1600 240 Z"
          fill="#E8DDFF"
          className="premium-sky__accent-float"
          style={{ animationDelay: '2s' }}
        />
        <path
          d="M960 160 C1020 100 1100 90 1120 150 C1090 180 1010 190 960 160 Z"
          fill="#C4B0F0"
          className="premium-sky__accent-float"
          style={{ animationDelay: '4s' }}
        />
      </g>
    )
  }

  if (variant === 'lantern') {
    return (
      <g className="premium-sky__accent" opacity="0.2">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = -Math.PI / 2 + (i - 2.5) * 0.22
          const x2 = 960 + Math.cos(a) * 520
          const y2 = 900 + Math.sin(a) * 380
          return (
            <line
              key={i}
              x1="960"
              y1="780"
              x2={x2}
              y2={y2}
              stroke="#FFDEAD"
              strokeWidth="2"
              className="premium-sky__ray"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          )
        })}
      </g>
    )
  }

  if (variant === 'balloon') {
    return (
      <g className="premium-sky__accent" opacity="0.25">
        <path
          d="M0 820 Q480 760 960 780 T1920 820 V1080 H0 Z"
          fill="#C8D8F0"
          opacity="0.35"
        />
        <path
          d="M0 880 Q640 820 960 840 T1920 880 V1080 H0 Z"
          fill="#B0C8E8"
          opacity="0.2"
          className="premium-sky__accent-float"
        />
      </g>
    )
  }

  if (variant === 'guide') {
    return (
      <g className="premium-sky__atmo" opacity="0.07">
        <circle cx="280" cy="220" r="140" fill="#FFFFFF" className="premium-sky__atmo-pulse" />
        <circle cx="1500" cy="280" r="180" fill="#FFFFFF" className="premium-sky__atmo-pulse" style={{ animationDelay: '3s' }} />
      </g>
    )
  }

  // final / light — golden rays
  return (
    <g className="premium-sky__accent" opacity="0.18">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = -Math.PI / 2 + (i - 3.5) * 0.18
        const x2 = 960 + Math.cos(a) * 600
        const y2 = 700 + Math.sin(a) * 450
        return (
          <line
            key={i}
            x1="960"
            y1="620"
            x2={x2}
            y2={y2}
            stroke="#FFDEAD"
            strokeWidth="2.5"
            className="premium-sky__ray"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        )
      })}
    </g>
  )
}

const SPARKLES = [
  { x: 210, y: 140, r: 2.5, d: 0 },
  { x: 480, y: 120, r: 1.8, d: 0.6 },
  { x: 740, y: 180, r: 2.2, d: 1.1 },
  { x: 980, y: 90, r: 3, d: 0.3 },
  { x: 1260, y: 160, r: 2.4, d: 1.8 },
  { x: 1510, y: 110, r: 2, d: 0.9 },
  { x: 1710, y: 180, r: 2.8, d: 2.2 },
  { x: 320, y: 300, r: 1.6, d: 1.4 },
  { x: 660, y: 260, r: 1.8, d: 0.5 },
  { x: 1110, y: 280, r: 2.1, d: 2.5 },
  { x: 1480, y: 250, r: 1.7, d: 1.7 },
]

const DUST = [
  { x: 420, y: 520, r: 3, d: 0 },
  { x: 780, y: 480, r: 2, d: 1 },
  { x: 1120, y: 540, r: 2.5, d: 2 },
  { x: 1380, y: 460, r: 2, d: 0.4 },
  { x: 620, y: 620, r: 1.8, d: 1.6 },
  { x: 1680, y: 500, r: 2.2, d: 0.8 },
]
