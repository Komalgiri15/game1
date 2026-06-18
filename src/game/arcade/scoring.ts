import { ACHIEVEMENTS } from '../constants'
import type { RunStats } from '../types'

/** Points per myth bust by current combo count */
export function comboPoints(combo: number): number {
  if (combo <= 1) return 100
  if (combo === 2) return 150
  if (combo === 3) return 200
  if (combo === 4) return 250
  return 300
}

export function nextComboPoints(currentCombo: number): number {
  return comboPoints(currentCombo + 1)
}

export function checkNewBadge(
  combo: number,
  alreadyEarned: string[],
): string | null {
  const earned = [...alreadyEarned]
  let newest: string | null = null
  for (const a of ACHIEVEMENTS) {
    if (combo >= a.streak && !earned.includes(a.title)) {
      earned.push(a.title)
      newest = a.title
    }
  }
  return newest
}

export function isTruthMaster(combo: number): boolean {
  return combo >= 5
}

export const XP_PER_MYTH = 25
export const XP_PER_FACT = 15
export const GEMS_PER_MYTH = 1
export const GEMS_PER_FACT = 1

export interface StageGiftReward {
  points: number
  xp: number
  gems: number
  highlights: string[]
}

/** Bonus inside the stage-clear gift box */
export function calculateStageGiftBonus(
  stageIndex: number,
  stats: RunStats,
  clarityLeft: number,
): StageGiftReward {
  const basePoints = 200 + stageIndex * 75
  const comboBonus = stats.bestCombo * 30
  const clarityBonus = clarityLeft * 40
  const gems = 2 + stageIndex + (stats.bestCombo >= 5 ? 1 : 0)
  const xp = 50 + stats.mythsBusted * 12

  const highlights: string[] = [
    `+${basePoints + comboBonus + clarityBonus} journey points`,
    `+${gems} Truth Gems`,
    `+${xp} XP`,
  ]

  if (stats.bestCombo >= 3) {
    highlights.push(`Clarity Streak — best ${stats.bestCombo}x combo`)
  }
  for (const a of ACHIEVEMENTS) {
    if (stats.bestCombo >= a.streak && stats.badgesEarned.includes(a.title)) {
      highlights.push(`Badge earned: ${a.title}`)
    }
  }
  if (isTruthMaster(stats.bestCombo)) {
    highlights.push('TRUTH MASTER! — 5+ myth streak')
  }

  return {
    points: basePoints + comboBonus + clarityBonus,
    xp,
    gems,
    highlights,
  }
}
