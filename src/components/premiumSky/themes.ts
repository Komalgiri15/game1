import type { AvatarId } from '../../game/types'
import type { SkyVariant } from './types'

export interface PremiumSkyTheme {
  skyStops: [string, string, string, string]
  glowCx: number
  glowCy: number
  glowRx: number
  glowRy: number
  glowStops: [string, string, string]
  cloudNearTop: string
  cloudNearBottom: string
  cloudFarTop: string
  cloudFarBottom: string
  distantFill: string
  distantFillAlt: string
  sparkle: string
  dust: string
  dustAlt: string
  edgeCloud: string
}

export const PREMIUM_SKY_THEMES: Record<SkyVariant, PremiumSkyTheme> = {
  guide: {
    skyStops: ['#FDF8F5', '#F7E8E8', '#E8CBD5', '#D9AFC1'],
    glowCx: 960,
    glowCy: 380,
    glowRx: 700,
    glowRy: 420,
    glowStops: ['#FFF8F2', '#F8DCCB', '#F8DCCB'],
    cloudNearTop: '#FCEFEF',
    cloudNearBottom: '#EFD8DF',
    cloudFarTop: '#FFFDFB',
    cloudFarBottom: '#F5E7E8',
    distantFill: '#FFFFFF',
    distantFillAlt: '#FFF7F7',
    sparkle: '#FFFDF8',
    dust: '#FFE8EE',
    dustAlt: '#FFF5F8',
    edgeCloud: '#FFF8F6',
  },
  butterfly: {
    skyStops: ['#FAF5FF', '#EDE4FF', '#E0D4F8', '#D4C0EE'],
    glowCx: 820,
    glowCy: 320,
    glowRx: 620,
    glowRy: 380,
    glowStops: ['#F5EEFF', '#D1C0FE', '#D1C0FE'],
    cloudNearTop: '#F8F4FF',
    cloudNearBottom: '#E4D8F5',
    cloudFarTop: '#FDFBFF',
    cloudFarBottom: '#EDE6FA',
    distantFill: '#FFFFFF',
    distantFillAlt: '#F3EDFF',
    sparkle: '#E8DDFF',
    dust: '#D1C0FE',
    dustAlt: '#F0E8FF',
    edgeCloud: '#F5F0FF',
  },
  lantern: {
    skyStops: ['#FFFBF7', '#FFF3E0', '#FFE8C8', '#FFD9A8'],
    glowCx: 960,
    glowCy: 520,
    glowRx: 780,
    glowRy: 460,
    glowStops: ['#FFF8F0', '#FFDEAD', '#FFDEAD'],
    cloudNearTop: '#FFF9F0',
    cloudNearBottom: '#F5E0C0',
    cloudFarTop: '#FFFDF8',
    cloudFarBottom: '#F8ECD8',
    distantFill: '#FFFCF8',
    distantFillAlt: '#FFF5E8',
    sparkle: '#FFEFC8',
    dust: '#FFD89A',
    dustAlt: '#FFF4E0',
    edgeCloud: '#FFF6EA',
  },
  balloon: {
    skyStops: ['#F5F9FF', '#E8F0FF', '#D8E4FF', '#C8D4F0'],
    glowCx: 1100,
    glowCy: 300,
    glowRx: 680,
    glowRy: 400,
    glowStops: ['#FFFFFF', '#D8E8FF', '#D8E8FF'],
    cloudNearTop: '#F8FBFF',
    cloudNearBottom: '#D8E4F5',
    cloudFarTop: '#FFFFFF',
    cloudFarBottom: '#E8EEF8',
    distantFill: '#FFFFFF',
    distantFillAlt: '#F0F6FF',
    sparkle: '#E0ECFF',
    dust: '#B8D0F0',
    dustAlt: '#E8F0FF',
    edgeCloud: '#F0F6FF',
  },
  light: {
    skyStops: ['#FFFBF7', '#FFF3DC', '#FFDEAD', '#F5D08A'],
    glowCx: 960,
    glowCy: 400,
    glowRx: 760,
    glowRy: 440,
    glowStops: ['#FFFFFF', '#FFDEAD', '#FFDEAD'],
    cloudNearTop: '#FFF8EE',
    cloudNearBottom: '#F0D8A8',
    cloudFarTop: '#FFFDF8',
    cloudFarBottom: '#F8ECD0',
    distantFill: '#FFFCF6',
    distantFillAlt: '#FFF5E0',
    sparkle: '#FFF4D0',
    dust: '#FFD89A',
    dustAlt: '#FFF0D0',
    edgeCloud: '#FFF8EE',
  },
  final: {
    skyStops: ['#FFFBF7', '#FFF3DC', '#FFDEAD', '#F5D08A'],
    glowCx: 960,
    glowCy: 400,
    glowRx: 760,
    glowRy: 440,
    glowStops: ['#FFFFFF', '#FFDEAD', '#FFDEAD'],
    cloudNearTop: '#FFF8EE',
    cloudNearBottom: '#F0D8A8',
    cloudFarTop: '#FFFDF8',
    cloudFarBottom: '#F8ECD0',
    distantFill: '#FFFCF6',
    distantFillAlt: '#FFF5E0',
    sparkle: '#FFF4D0',
    dust: '#FFD89A',
    dustAlt: '#FFF0D0',
    edgeCloud: '#FFF8EE',
  },
}

export function resolvePremiumVariant(variant: SkyVariant): keyof typeof PREMIUM_SKY_THEMES {
  if (variant === 'light') return 'final'
  return variant
}

export const PREMIUM_SKY_TYPES: AvatarId[] = ['guide', 'butterfly', 'lantern', 'balloon']

export function usesPremiumSky(avatarId: AvatarId, isFinal: boolean): boolean {
  if (isFinal) return true
  return PREMIUM_SKY_TYPES.includes(avatarId)
}
