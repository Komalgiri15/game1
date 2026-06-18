export type { SkyVariant } from './premiumSky/types'
import { PremiumSpiritSky } from './premiumSky/PremiumSpiritSky'
import type { SkyVariant } from './premiumSky/types'

interface AnimatedSkySvgProps {
  variant: SkyVariant
  className?: string
}

/** Premium parallax skies for all spirit types */
export function AnimatedSkySvg({ variant, className = '' }: AnimatedSkySvgProps) {
  return <PremiumSpiritSky variant={variant} className={className} />
}
