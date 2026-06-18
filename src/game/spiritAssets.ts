import type { AvatarId } from './types'
import card1 from '../assets/card1.png'
import card2 from '../assets/card2.png'
import card3 from '../assets/card3.png'
import card4 from '../assets/card4.png'

/** Cloud drift tuning per type — SVG sky handles the atmosphere */
export interface SpiritCloudTheme {
  cloudTint: string
  cloudTint2: string
  cloudSpeed: number
}

/** card1 = Guide, card2 = Butterfly, card3 = Lantern, card4 = Balloon */
export const SPIRIT_IMAGES: Record<AvatarId, string> = {
  guide: card1,
  butterfly: card2,
  lantern: card3,
  balloon: card4,
  light: card3,
}

export const SPIRIT_CLOUD_THEMES: Record<AvatarId, SpiritCloudTheme> = {
  guide: {
    cloudTint: 'rgba(255, 185, 205, 0.45)',
    cloudTint2: 'rgba(255, 217, 227, 0.3)',
    cloudSpeed: 1,
  },
  butterfly: {
    cloudTint: 'rgba(209, 192, 254, 0.45)',
    cloudTint2: 'rgba(232, 221, 255, 0.3)',
    cloudSpeed: 1.15,
  },
  lantern: {
    cloudTint: 'rgba(255, 222, 173, 0.45)',
    cloudTint2: 'rgba(214, 168, 92, 0.32)',
    cloudSpeed: 0.85,
  },
  balloon: {
    cloudTint: 'rgba(180, 200, 255, 0.45)',
    cloudTint2: 'rgba(232, 221, 255, 0.3)',
    cloudSpeed: 1.25,
  },
  light: {
    cloudTint: 'rgba(255, 236, 200, 0.45)',
    cloudTint2: 'rgba(255, 222, 173, 0.35)',
    cloudSpeed: 0.9,
  },
}

export function getSpiritCloudTheme(avatarId: AvatarId, isFinal: boolean): SpiritCloudTheme {
  if (isFinal) return SPIRIT_CLOUD_THEMES.light
  return SPIRIT_CLOUD_THEMES[avatarId] ?? SPIRIT_CLOUD_THEMES.guide
}

export const SELECTABLE_SPIRITS: AvatarId[] = ['guide', 'butterfly', 'lantern', 'balloon']
