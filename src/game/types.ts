export type GamePhase =
  | 'setup-cards'
  | 'setup-spirit'
  | 'intro'
  | 'playing'
  | 'stage-clear'
  | 'final-intro'
  | 'final-truth'
  | 'results'

export type DifficultyId = 'starting-out' | 'informed' | 'confident'

export type ResultType = 'full' | 'partial'

export type StageId = 'perimenopause' | 'menopause' | 'post-menopause'

export type CardFeedback = 'none' | 'busted' | 'still-believed'

export interface DifficultyLevel {
  id: DifficultyId
  label: string
  description: string
  startingClarity: number
  questionTime: number
  timerLabel: string
}

export type QuestionTier = 'simple' | 'nuanced' | 'hard'

export interface MythQuestionSet {
  id: string
  statement: string
  isTrue: boolean
  truth: string
  tier?: QuestionTier
}

export interface MythQuestion {
  statement: string
  isTrue: boolean
  truth: string
}

export interface StageConfig {
  id: StageId
  title: string
  subtitle: string
  clearBanner: string
  correctToClear: number
  stageColor: string
  stageColorDim: string
  bgClass: string
}

export interface FinalTruthPart {
  statement: string
  isTrue: boolean
  truth: string
}

export interface BustedMyth {
  statement: string
  truth: string
  stage: string
}

export type AvatarId = 'guide' | 'lantern' | 'butterfly' | 'balloon' | 'light'

export interface RunStats {
  score: number
  combo: number
  bestCombo: number
  xp: number
  gems: number
  mythsBusted: number
  badgesEarned: string[]
}

export interface FactOrbData {
  id: string
  label: string
  truth: string
}

export interface AchievementDef {
  streak: number
  title: string
}

export interface AvatarDef {
  id: AvatarId
  label: string
  description: string
}
