import type { DifficultyId } from './types'
import { FINAL_TRUTH_ALTERNATES, FINAL_TRUTH_DEFAULT, QUESTION_BANK, STAGES } from './constants'

export function toMythQuestion(q: (typeof QUESTION_BANK)[number]) {
  return { statement: q.statement, isTrue: q.isTrue, truth: q.truth }
}

function poolForStage(stageIndex: number) {
  const stageId = STAGES[stageIndex]?.id
  if (!stageId) return []

  return QUESTION_BANK.filter((q) => {
    if (stageId === 'perimenopause') return q.id.startsWith('perimenopause-')
    if (stageId === 'menopause') return q.id.startsWith('menopause-')
    if (stageId === 'post-menopause') return q.id.startsWith('post-')
    return false
  })
}

export function getQuestionsForStage(
  stageIndex: number,
  difficultyId: DifficultyId,
) {
  const pool = poolForStage(stageIndex)
  if (pool.length === 0) return []

  if (stageIndex === 0) return pool.map(toMythQuestion)

  if (difficultyId === 'starting-out') {
    return pool.filter((q) => q.tier === 'simple').map(toMythQuestion)
  }
  if (difficultyId === 'informed') {
    return pool.filter((q) => q.tier === 'nuanced').map(toMythQuestion)
  }
  return pool.filter((q) => q.tier === 'hard' || q.tier === 'nuanced').map(toMythQuestion)
}

export function getClosingReflection(
  resultType: 'full' | 'partial',
  stagesCleared: number,
  reachedFinalTruth: boolean,
): string {
  if (resultType === 'full') {
    return 'You walked the entire journey and came out the other side with real understanding.'
  }
  if (reachedFinalTruth) {
    return 'You reached The Final Truth — the hardest moment of all. A little more Clarity next time will carry you through.'
  }
  if (stagesCleared >= 2) {
    return "You've cleared the heart of the journey — post-menopause myths are where many people learn the most."
  }
  if (stagesCleared >= 1) {
    return "You've busted the earliest myths — there's a lot more clarity waiting in Menopause and beyond."
  }
  return "You've started busting the first myths of perimenopause — every answer builds real understanding."
}

export function getNextDifficulty(current: DifficultyId): DifficultyId | null {
  if (current === 'starting-out') return 'informed'
  if (current === 'informed') return 'confident'
  return null
}

export function pickFinalTruthPair(difficultyId: DifficultyId) {
  if (difficultyId === 'confident' && FINAL_TRUTH_ALTERNATES.length > 0) {
    const idx = Math.floor(Math.random() * FINAL_TRUTH_ALTERNATES.length)
    return FINAL_TRUTH_ALTERNATES[idx]
  }
  return FINAL_TRUTH_DEFAULT
}
